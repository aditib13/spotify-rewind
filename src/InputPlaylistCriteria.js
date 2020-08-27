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
      cookies.set('access_token', data.access_token, { path: '/', sameSite: 'none', secure: true });
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
    let access_Token = cookies.get('access_token');
    let queryString = `/view-playlist-tracks/year=${year}&num=${num}&genres=${genres}&accessToken=${access_Token}`;
    history.push(queryString);
  }

  return (
    <div className="column">
      <div className="row">
        <div className="topnav">
          <a className="left" href="/">Spotify Rewind</a>
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
        </div>
      </div>
    </div>
  );
}

export default InputPlaylistCriteria;
