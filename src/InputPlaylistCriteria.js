import React, { useState} from 'react';
import { useHistory} from 'react-router-dom';
import Select from 'react-select';
import Popup from 'react-popup';
import { genreList } from './GenreList.js';
import queryString from 'query-string';
import Cookies from 'universal-cookie';
import './InputPlaylistCriteria.css';


function InputPlaylistCriteria(props) {
  const cookies = new Cookies();
  let isLoggedIn = (typeof cookies.get('access_token') !== 'undefined');
  let loginMessage = '';

  if (isLoggedIn) {
    console.log("timestamp:", cookies.get('timestamp'));
    console.log("time elapsed:", Math.floor(Date.now() / 1000) - cookies.get('timestamp'));
    console.log("refresh token:", cookies.get('refresh_token'));
    
    let timestamp = cookies.get('timestamp');
    if (Math.floor(Date.now() / 1000 - timestamp) >= 3600 || timestamp === 'undefined') {
      fetch(`/refresh-token/${cookies.get('refresh_token')}`).then(res => res.json()).then(data => {
        cookies.set('access_token', data.access_token, { path: '/' });
        cookies.set('timestamp', Math.floor(Date.now() / 1000), { path: '/' });
      });
    }
    loginMessage = 'Logged In';
  }
  else {
    loginMessage = 'Login to Spotify';
  }
  
  const query = queryString.parse(props.location.search);
  const code = query['code'];

  if (typeof code !== 'undefined' && !isLoggedIn) {
    LogIn();
  }

  function LogIn() {
    fetch(`/logged-in/${code}`).then(res => res.json()).then(data => {
      cookies.set('code', code, { path: '/' });
      cookies.set('access_token', data.access_token, { path: '/' });
      cookies.set('refresh_token', data.refresh_token, { path: '/' });
      cookies.set('timestamp', Math.floor(Date.now() / 1000), { path: '/' });
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

  function errorChecking(year, num, genres) {
    const currYear = new Date().getFullYear();
    // check for correct inputs
    if (genres.length <= 0 || num == '' || year == '') {
      console.log("error!!!");
      alert(`Please fill in all fields.`);
      return -1;
    }
    if (year < 1800 || year > currYear) {
      alert(`Please enter a year between 1800 and ${currYear}.`);
      return -1;
    }
    if (num < 0 || num > 200) {
      alert(`Please pick a number between 0 and 200.`);
      return -1;
    }
    if (genres.length > num) {
      alert(`Please pick more genres than amount of songs.`);
      return -1;
    }
    if (isNaN(num) && isNaN(year)) {
      alert(`Please pick a valid year and number.`);
      return -1;
    }
    if (isNaN(year)) {
      alert(`Please pick a valid year.`);
      return -1;
    }
    if (isNaN(num)) {
      alert(`Please pick a valid number.`);
      return -1;
    }
    if (genres.length > 5) {
      alert(`Please limit your search to 5 or less genres.`);
      return -1;
    }
  }

  const history = useHistory();
  const [year, setYear] = useState('');
  const [num, setNum] = useState('');

  function results(accessToken) {
    // check for correct inputs
    if (errorChecking(year, num, genres) == -1) {
      return;
    }

    let access_token = cookies.get('access_token');
    let queryString = `/view-playlist-tracks/year=${year}&num=${num}&genres=${genres}&accessToken=${access_token}`;
    history.push(queryString);
  }

  const login = (e) => {
    let SPOTIFY_CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    console.log("client id", SPOTIFY_CLIENT_ID);
    console.log("login entered")
    let authQuery = 'https://accounts.spotify.com/authorize'
    let authParams = {
      'client_id': SPOTIFY_CLIENT_ID,
      'response_type': 'code',
      'redirect_uri': "https://spotify-rewind-app.herokuapp.com/logged-in",
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
          <hr
            style={{
              borderColor: "white",
              width: 1000,
              marginTop: 60
            }}
          />
        </div>
      </div>
      
    </div>
  );
}

export default InputPlaylistCriteria;
