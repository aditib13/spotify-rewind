import base64
import time
from flask import Flask, redirect, request
from flask_cors import CORS, cross_origin
import logging
import requests
import pprint
import math
from urllib.parse import quote

app = Flask(__name__)
app.run(debug=True)
CORS(app)

# spotify search auth info
SPOTIFY_CLIENT_ID = 'd831937ac99d4ebba9b65e864fccd8c1'
SPOTIFY_CLIENT_SECRET = '72d5216654ef416e90a47c0d82b45360'

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

# spotify authentication
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
        return {'tracks': search(year, int(num), ALL_GENRES, MAX_SONGS)}
    else:
        return {'tracks': allocate_genre_amounts(year, int(num), genres)}
    
def get_all_songs_per_genre(year, num, genres):
    num_genres = genres.count(",") + 1
    max_tracks_per_genre = math.ceil(MAX_SONGS/num_genres)
    popular_tracks_by_genre = {}
    
    for genre in genres.split(','):
        popular_tracks_by_genre[genre] = search(year, num, genre, max_tracks_per_genre)
        if len(popular_tracks_by_genre[genre]) == 0:
            del popular_tracks_by_genre[genre]

    # print("popular_tracks_by_genre:", popular_tracks_by_genre)
    return popular_tracks_by_genre

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
    sorted_tracks = sort_by_popularity(int(num), tracks, year)
    return sorted_tracks

# takes a list of tracks and sorts them by popularity
def sort_by_popularity(number, tracks, year):
    top_n_tracks_names = []
    top_n_tracks_uris = []
    popularity_list = []

    # todo: do something to make it unique by name of track
    for idx, track in enumerate(tracks):
        popularity_list.append([track['popularity'], track['uri'], track['name'], idx])
    popularity_list.sort(key=lambda x: x[POPULARITY], reverse=True)

    pops = [p[POPULARITY] for p in popularity_list[:200]]
    # print("popularities:", pops)
    indexes = [p[3] for p in popularity_list[:200]]
    # print("idx:", sorted(indexes))

    for i in range(min(number, len(popularity_list))):
        top_n_tracks_uris.append(popularity_list[i][URI])
        top_n_tracks_names.append([popularity_list[i][NAME], popularity_list[i][POPULARITY], popularity_list[i][URI]])
    # print(top_n_tracks_names)

    # add_to_playlist(year, number, top_n_tracks_uris)

    return top_n_tracks_names


def allocate_genre_amounts(year, num, genres):
    popular_tracks_by_genre = get_all_songs_per_genre(year, num, genres)
    num_genres = len(popular_tracks_by_genre)
    print("len:", num_genres)
    max_tracks_per_genre = min((num//num_genres), (MAX_SONGS//num_genres))
    print("max tracks per genre:", max_tracks_per_genre)
    final_list_of_popular_tracks = []
    
    num_tracks_remaining = 0
    
    for genre in list(popular_tracks_by_genre):
        # get rid of duplicates
        unique_songs_list = []
        for track in popular_tracks_by_genre[genre]:
            if track not in final_list_of_popular_tracks:
                unique_songs_list.append(track)
        popular_tracks_by_genre[genre] = unique_songs_list

        num_tracks = min(max_tracks_per_genre, len(popular_tracks_by_genre[genre]))
        print("num tracks:", num_tracks)
        num_tracks_remaining += (max_tracks_per_genre - num_tracks)
        print("num tracks remaining:", num_tracks_remaining)
        final_list_of_popular_tracks.extend(popular_tracks_by_genre[genre][:num_tracks])
        del popular_tracks_by_genre[genre][:num_tracks]

        if num_tracks <= max_tracks_per_genre:
            del popular_tracks_by_genre[genre]
    
    while num_tracks_remaining > 0:
        additional_tracks_per_genre = num_tracks_remaining//len(popular_tracks_by_genre[genre])

        for genre in list(popular_tracks_by_genre):
            num_tracks = min(additional_tracks_per_genre, len(popular_tracks_by_genre[genre]))
            print("num tracks:", num_tracks)
            final_list_of_popular_tracks.extend(popular_tracks_by_genre[genre][:num_tracks])
            num_tracks_remaining -= num_tracks

            if num_tracks <= additional_tracks_per_genre:
                del popular_tracks_by_genre[genre]

    print("final list:", final_list_of_popular_tracks)
    return final_list_of_popular_tracks


#---------------------------------------------SPOTIFY PLAYLIST CREATION--------------------------------------------


@app.route('/create-playlist/<year>/<num>/<access_token>')
def create_final_playlist(year, num, uris, access_token):
    playlist_id = create_playlist_on_spotify(year, num)
    print("playlist id:", playlist_id)
    add_query = "https://api.spotify.com/v1/playlists/{}/tracks".format(playlist_id)
    request_data = json.dumps(uris)
    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer {}'.format(access_token),
    }

    response = requests.post(url=add_query, data=request_data, headers=headers).json()
    print("create final playlist response:", response)
    return response

def refresh_token(code):
    token_query = 'https://example.com/v1/refresh'
    request_body = {
        'code': code
    }
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded'
    }

    response = requests.post(url=token_query, data=request_body, headers=headers).json()
    return response['access_token'], response['refresh_token']

def get_user_id(access_token):
    user_query = 'https://api.spotify.com/v1/me'
    headers = {
        'Authorization': access_token
    }

    response = requests.get(headers=headers)
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

# @app.route('/login')
# @cross_origin(origin='localhost',headers=['Content- Type','Authorization'])
# def login():
#     print("Entering login")
#     auth_query = 'https://accounts.spotify.com/authorize'
#     auth_params = {
#         'client_id': SPOTIFY_CLIENT_ID,
#         'response_type': 'code',
#         'redirect_uri': "http://localhost:3000/logged-in",
#         'scope': 'playlist-modify-public'
#     }

#     url_args = "&".join(["{}={}".format(key, quote(val)) for key, val in auth_params.items()])
#     auth_url = "{}?{}".format(auth_query, url_args)
#     print("auth_url: ", auth_url)
#     print("redirect", redirect(auth_url))
#     return redirect(auth_url, code=302)
    
@app.route('/logged-in/<code>')
def get_access_token(code):
    try:
        print("logged in entered")
        print('code:', code)

        encoded_data = base64.b64encode(bytes("{}:{}".format(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET), "ISO-8859-1")).decode("ascii")
        print("encoded data:", encoded_data)
        token_query = 'https://accounts.spotify.com/api/token'
        request_body = {
            'grant_type': "authorization_code",
            'code': code,
            'redirect_uri': "http://localhost:3000/logged-in"
        }
        headers = {
            'Authorization': "Basic {}".format(encoded_data)
        }

        response = requests.post(url=token_query, data=request_body, headers=headers, auth=(SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET)).json()
        print(response)
        access_token = response['access_token']
        refresh_token = response['refresh_token']
        print("RESPONSE:", response)
        print("access_token:", response['access_token'])
        return {"access_token": response['access_token']}
    except Exception as e:
        print('Unexpected exception found for get_access_token: {}'.format(e))
        return {}


