import React from 'react';
import './Login.css';

function Login() {
  const login = (e) => {
    let SPOTIFY_CLIENT_ID = 'd831937ac99d4ebba9b65e864fccd8c1'
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
          <a className="right" onClick={login}>Login to Spotify</a>
        </div>
        <div className="top">
            <p>Welcome to Spotify Rewind! Login to your account to get started.</p>
        </div>
      </div>
      <div className="row">
        <div className="bottom">
        </div>
      </div>
    </div>
  );
}

export default Login;
