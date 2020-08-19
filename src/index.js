import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import Login from './Login';
import InputPlaylistCriteria from './InputPlaylistCriteria';
import PlaylistTracks from './PlaylistTracks';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <App/>,
  document.getElementById('root')
);

function App() {
  return <BrowserRouter>
  <Switch>
    {/* <Route exact path="/" component={Input} /> */}
    <Route exact path="/" component={Login} />
    <Route exact path="/logged-in" component={InputPlaylistCriteria} />
    <Route exact path="/view-playlist-tracks/:query" component={PlaylistTracks} />
  </Switch>
  </BrowserRouter>
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
