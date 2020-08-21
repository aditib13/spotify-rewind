import React from 'react'
import queryString from 'query-string'
import './PlaylistTracks.css';

function PlaylistTracks(props) {
  console.log("props: ", props, 333, props.match);
  const query = queryString.parse(props.match.params.query);
  const year = query.year;
  const num = query.num;
  const genres = query.genres;
  const accessToken = query.accessToken;
  console.log(year, num, genres, accessToken);
  let uris = [];

  function createPlaylist() {
    console.log("createPlaylist entered");
    fetch(`/create-playlist/${year}/${num}/${accessToken}/${uris}`).then(data => {
        console.log("Playlist Created!");
    });
  }

  // calls route in app.py to connect to spotify with given inputs
  fetch(`/input/${year}/${num}/${genres}`).then(res => res.json()).then(data => {
    const tracks = data.tracks;
    uris = data.uris;
    // spotify_urls = data.spotify_urls; // add link to song name maybe
    console.log(tracks);
    console.log(uris);

    // returns tracks as a list
    var trackList = tracks.map(function (track, i) {
      return track[0];
    })

    // returns track url TODO
    var trackUrl = tracks.map(function (track, i) {
      return track[2];
    })

    // function createPlaylist() {
    //   console.log("createPlaylist entered");
    //   fetch(`/create-playlist/${year}/${num}/${accessToken}`).then(data => {
    //       console.log("Playlist Created!");
    //   });
    // }

    // function markUp() {
    //   return (
    //     <div className="TracksHTML">
    //       <p> Top Tracks of ${year} </p>
    //       <div className="box">
    //         <li> + ${trackList}.join(</li><li>) + </li>
    //       </div>
    //       <input type="button" onClick={createPlaylist} value="Create Playlist" />
    //     </div>
    //   );
    // }

    // markUp();

    document.getElementById('trackList').innerHTML =
      `<p> Top Tracks of ${year} </p> 
        <div id="box"> 
            <li>` + trackList.join(`</li><li>`) + `</li> 
        </div>`
  });

  return (
    <div className="PlaylistTracks">
    <div className="topnav">
        <a className="left" href="/">Spotify Rewind</a>
    </div>
    <header className="PlaylistTracks-header">
        <div className='Tracks'>
        <ul id="trackList"></ul>
        <input type="button" onClick={createPlaylist} value="Create Playlist" />
        </div>
    </header>
    </div>
  );
}

export default PlaylistTracks;
