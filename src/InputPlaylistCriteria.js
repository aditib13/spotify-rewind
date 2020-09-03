import React, { useState} from 'react';
import { useHistory} from 'react-router-dom';
import Select from 'react-select'
import Popup from "reactjs-popup";
import { genreList } from './GenreList.js'
import queryString from 'query-string'
import Cookies from 'universal-cookie';
import './InputPlaylistCriteria.css';

function InputPlaylistCriteria(props) {
  const cookies = new Cookies();
  const isLoggedIn = (typeof cookies.get('access_token') !== 'undefined');
  let loginMessage = ''

  if (isLoggedIn) {
    loginMessage = 'Logged In';
  }
  else {
    loginMessage = 'Login to Spotify'
  }
  
  const query = queryString.parse(props.location.search);
  const code = query['code'];
  console.log("0 (global): code: ", code);
  console.log("1. (global) isLoggedIn", isLoggedIn);

  // should check if there is also a logged in cookie (think about expiration, maybe couple hours)

  if (typeof code !== 'undefined' && !isLoggedIn) {
    loggedIn();
  }

  // should also store this in a cookie
  const [accessToken, setAccessToken] = useState('');
  function loggedIn() {
    fetch(`/logged-in/${code}`).then(res => res.json()).then(data => {
      console.log("2 isLoggedIn:", isLoggedIn);
      console.log("3 Logged in entered", data);
      cookies.set('access_token', data.access_token, { path: '/' });
      let isLoggedInCopy = (typeof cookies.get('access_token') !== 'undefined');

      console.log("4 checking if cookie is set isLoggedInCopy", isLoggedInCopy);
      // store locally and in cookies here
      console.log("5 cookies access_token value: ", cookies.get('access_token'));
      // after auth is set, redirect to the base url
      setAccessToken(data.access_token);
    });
  }
  

  // selected genre
  const [genres, setGenres] = useState([]);
  const handleGenre = (e) => {
    console.log(genres);
    if (Array.isArray(e)) {
      setGenres(e.map(x => x.value));
    } 
    else {
      setGenres([]);
    }
  }

  const history = useHistory();
  const [year, setYear] = useState('');
  const [num, setNum] = useState('');

  function results(accessToken) {
    const currYear = new Date().getFullYear()
    // check for correct inputs
    if (genres.length < 0 || num == '' || year == '') {
      alert(`Please fill in all fields.`);
      return;
    }
    if (year < 1800 || year > currYear) {
      alert(`Please enter a year between 1800 and ${currYear}.`);
      return;
    }
    if (num < 0 || num > 200) {
      alert(`Please pick a number between 0 and 200.`);
      return;
    }
    if (genres.length > num) {
      alert(`Please pick more genres than amount of songs.`);
      return;
    }

    let access_token = cookies.get('access_token');
    let queryString = `/view-playlist-tracks/year=${year}&num=${num}&genres=${genres}&accessToken=${access_token}`;
    history.push(queryString);
  }

  const login = (e) => {
    let SPOTIFY_CLIENT_ID = 'd831937ac99d4ebba9b65e864fccd8c1'
    console.log("login entered")
    let authQuery = 'https://accounts.spotify.com/authorize'
    let authParams = {
      'client_id': SPOTIFY_CLIENT_ID,
      'response_type': 'code',
      'redirect_uri': "http://localhost:3000/logged-in",
      'scope': 'playlist-modify-public'
    }
    var urlArgs = Object.keys(authParams).map(key => key + '=' + authParams[key]).join('&');
    var authUrl = `${authQuery}?${urlArgs}`;
    console.log(authUrl);
    window.location.assign(authUrl);
  }

  return (
    <div className="column">
      <div className="row">
        <div className="topnav">
          <a className="left" href="/">Spotify Rewind</a>
          <button className="right" onClick={login}>{loginMessage}</button>
        </div>
        <div className="top">
          <p>Please enter a year and the number of tracks you want in your playlist.</p>
        <form>
          <label>
            Year: 
            <input type="text" name="name" className="InputValues" onChange={e => setYear(e.target.value)}/>
          </label>
          <label>
            #: 
            <input type="text" name="name" className="InputValues" onChange={e => setNum(e.target.value)}/>
          </label>
          <Select
            isMulti
            isClearable
            closeMenuOnSelect={false}
            options={genreList}
            className="dropdown"
            onChange={handleGenre}
            placeholder='select genre(s)...'
          />
          <input type="button" onClick={results} value="Submit" className="Submit" />
        </form>
        </div>
      </div>
      <div className="row">
        <div className="bottom">
          <p>Please log in to Spotify at the top to connect to your account.</p>
        </div>
      </div>
    </div>
  );
}

export default InputPlaylistCriteria;
