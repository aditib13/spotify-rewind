import base64
import time
from decouple import config
from flask import Flask, redirect, request
from flask_cors import CORS, cross_origin
import json
import logging
import requests
import pprint
import math
from urllib.parse import quote

if __name__ == '__main__':
    app.run()
CORS(app)

# Spotify search auth info
SPOTIFY_CLIENT_ID = config('SPOTIFY_CLIENT_ID')
SPOTIFY_CLIENT_SECRET = config('SPOTIFY_CLIENT_SECRET')

# Searching for tracks
ALL_GENRES = 'all genres'
TOTAL_SEARCH_LIMIT = 250
SINGLE_SEARCH_LIMIT = 50
POPULARITY = 0
URI = 1
NAME = 2

# Playlist Restrictions
MAX_SONGS = 200
MAX_GENRES = 5

# Spotify authentication
def spotify_authenticate(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET):
    data = {'grant_type': 'client_credentials'}
    url = 'https://accounts.spotify.com/api/token'
    response = requests.post(url, data=data, auth=(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET))
    return response.json()['access_token']


#--------------------------------------------------TRACKS RETRIEVAL--------------------------------------------------


@app.route('/input/<year>/<num>/<genres>')
def tracks(year, num, genres):
    print('Tracks function entered. args: {}'.format(locals()))
    
    if ALL_GENRES in genres:
        tracks, uris = search(year, int(num), ALL_GENRES, MAX_SONGS)
        return {'tracks': tracks, 'uris': uris}
    else:
        tracks, uris = allocate_genre_amounts(year, int(num), genres)
        return {'tracks': tracks, 'uris': uris}
    
def get_all_songs_per_genre(year, num, genres):
    num_genres = genres.count(",") + 1
    max_tracks_per_genre = math.ceil(MAX_SONGS/num_genres)
    popular_tracks_by_genre = {}
    uris_by_genre = {}
    uris = []
    
    for genre in genres.split(','):
        popular_tracks_by_genre[genre], uris_by_genre[genre] = search(year, num, genre, max_tracks_per_genre)

        if len(popular_tracks_by_genre[genre]) == 0:
            del popular_tracks_by_genre[genre]
            del uris_by_genre[genre]

    print("get all songs uris", uris)
    return popular_tracks_by_genre, uris_by_genre

def search(year, num, genre, max_tracks_per_genre):
    query = 'year:{} genre:{}'.format(year, genre)
    if genre == ALL_GENRES:
        query = 'year:{}'.format(year)
    
    token = spotify_authenticate(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)
    search_query = 'https://api.spotify.com/v1/search'
    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {}'.format(token),
    }
    params = {
        'q': query,
        'type': 'track',
        'limit': SINGLE_SEARCH_LIMIT,
        'offset': 0
    }

    offset = 0
    response = requests.get(search_query, headers=headers, params=params).json()
    tracks = response['tracks']['items']
    next_url = response['tracks']['next']

    num_requests = 1
    while next_url != None and offset <= TOTAL_SEARCH_LIMIT:
        num_requests += 1
        print("Delete Making requests {} to {} for {} songs".format(offset, offset+SINGLE_SEARCH_LIMIT, genre))
        offset += SINGLE_SEARCH_LIMIT
        params['offset'] = offset

        response = requests.get(search_query, headers=headers, params=params).json()
        tracks.extend(response['tracks']['items'])
        next_url = response['tracks']['next']
    sorted_tracks, uris = sort_by_popularity(int(num), tracks, year)
    print("search uris:", uris)
    return sorted_tracks, uris

# Takes a list of tracks and sorts them by popularity
def sort_by_popularity(number, tracks, year):
    top_n_tracks_names = []
    top_n_tracks_uris = []
    popularity_list = []

    for idx, track in enumerate(tracks):
        popularity_list.append([track['popularity'], track['uri'], track['name'], idx])
    popularity_list.sort(key=lambda x: x[POPULARITY], reverse=True)

    for i in range(min(number, len(popularity_list))):
        top_n_tracks_uris.append(popularity_list[i][URI])
        top_n_tracks_names.append([popularity_list[i][NAME], popularity_list[i][POPULARITY], popularity_list[i][URI]])
    print('sort uris:', top_n_tracks_uris)
    return top_n_tracks_names, top_n_tracks_uris


def allocate_genre_amounts(year, num, genres):
    popular_tracks_by_genre, uris_by_genre = get_all_songs_per_genre(year, num, genres)
    num_genres = len(popular_tracks_by_genre)
    print("len:", num_genres)
    max_tracks_per_genre = min((num//num_genres), (MAX_SONGS//num_genres))
    print("max tracks per genre:", max_tracks_per_genre)
    final_list_of_popular_tracks = []
    final_list_of_popular_uris = []
    
    num_tracks_remaining = 0

    # Goes through each genre, collects [num songs/num genre] unique songs and their uris
    for genre in list(popular_tracks_by_genre):
        unique_tracks_list = []
        unique_tracks_uris = []

        for idx, track in enumerate(popular_tracks_by_genre[genre]):
            if track not in final_list_of_popular_tracks:
                unique_tracks_list.append(track)
                unique_tracks_uris.append(uris_by_genre[genre][idx])

        popular_tracks_by_genre[genre] = unique_tracks_list
        uris_by_genre[genre] = unique_tracks_uris

        num_tracks = min(max_tracks_per_genre, len(popular_tracks_by_genre[genre]))
        print("num tracks:", num_tracks)
        num_tracks_remaining += (max_tracks_per_genre - num_tracks)
        print("num tracks remaining:", num_tracks_remaining)
        final_list_of_popular_tracks.extend(popular_tracks_by_genre[genre][:num_tracks])
        final_list_of_popular_uris.extend(uris_by_genre[genre][:num_tracks])
        
        del popular_tracks_by_genre[genre][:num_tracks]
        del uris_by_genre[genre][:num_tracks]

        if num_tracks <= max_tracks_per_genre:
            del popular_tracks_by_genre[genre]
            del uris_by_genre[genre]

    # Goes through each genre again, completes the leftover amount
    while num_tracks_remaining > 0:
        additional_tracks_per_genre = num_tracks_remaining//len(popular_tracks_by_genre[genre])

        for genre in list(popular_tracks_by_genre):
            num_tracks = min(additional_tracks_per_genre, len(popular_tracks_by_genre[genre]))
            print("num tracks:", num_tracks)
            final_list_of_popular_tracks.extend(popular_tracks_by_genre[genre][:num_tracks])
            final_list_of_popular_uris.extend(uris_by_genre[genre][:num_tracks])

            num_tracks_remaining -= num_tracks

            if num_tracks <= additional_tracks_per_genre:
                del popular_tracks_by_genre[genre]
                del uris_by_genre[genre]

    print("final list:", final_list_of_popular_tracks)
    return final_list_of_popular_tracks, final_list_of_popular_uris


#---------------------------------------------SPOTIFY PLAYLIST CREATION--------------------------------------------


@app.route('/create-playlist/<year>/<num>/<access_token>/<uris>')
def create_final_playlist(year, num, access_token, uris):
    # TODO: can only add 100 at a time
    playlist_id = create_playlist_on_spotify(year, num, access_token)
    print("playlist id:", playlist_id)
    add_query = "https://api.spotify.com/v1/playlists/{}/tracks".format(playlist_id)

    uris = uris.split(",")

    request_data = json.dumps(uris)
    print("request data:", request_data)
    
    headers = {
        'Authorization': 'Bearer {}'.format(access_token),
        'Content-Type': 'application/json'
    }

    response = requests.post(url=add_query, data=request_data, headers=headers).json()
    print("create final playlist response:", response)
    return response

def get_user_id(access_token):
    print("1 in get user id function")
    user_query = 'https://api.spotify.com/v1/me'
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    print("2 in get user id function")
    response = requests.get(url=user_query, headers=headers).json()
    print("3 in get user id function")
    print("user response:", response)
    user_id = response['id']
    print("user response:", response)
    return user_id

def create_playlist_on_spotify(year, num, access_token):    
    user_id = get_user_id(access_token)
    print("user_id:", user_id)
    create_query = 'https://api.spotify.com/v1/users/{}/playlists'.format(user_id)
    request_body = json.dumps({
        "name": "Top Tracks of {}".format(year),
        "description": "Top {} tracks of {} based on your chosen genres.".format(num, year)
    })
    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {}'.format(access_token),
    }

    response = requests.post(url=create_query, data=request_body, headers=headers).json()
    print("create playlist on spotify response", response)
    return response["id"]

#-------------------------------------------------------LOGIN----------------------------------------------------
    
@app.route('/logged-in/<code>')
def get_access_token(code):
    try:
        encoded_data = base64.b64encode(bytes("{}:{}".format(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET), "ISO-8859-1")).decode("ascii")
        token_query = 'https://accounts.spotify.com/api/token'
        request_body = {
            'grant_type': "authorization_code",
            'code': code,
            'redirect_uri': "https://spotify-rewind-app.herokuapp.com/logged-in"
        }
        headers = {
            'Authorization': "Basic {}".format(encoded_data)
        }

        response = requests.post(url=token_query, data=request_body, headers=headers, auth=(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)).json()
        access_token = response['access_token']
        refresh_token = response['refresh_token']
        return {"access_token": response['access_token'], "refresh_token": response['refresh_token']}
    except Exception as e:
        print('Unexpected exception found for get_access_token: {}'.format(e))
        return {}

@app.route('/refresh-token/<token>')
def refresh_token(token):
    print("code:", token)
    token_query = 'https://accounts.spotify.com/api/token'
    encoded_data = base64.b64encode(bytes("{}:{}".format(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET), "ISO-8859-1")).decode("ascii")
    request_body = {
        'grant_type': 'refresh_token',
        'refresh_token': token
    }
    headers = {
        'Authorization': "Basic {}".format(encoded_data),
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.post(url=token_query, data=request_body, headers=headers, auth=(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)).json()
    print("refresh response:", response)
    return {"access_token": response['access_token']}


