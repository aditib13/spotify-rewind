import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './InputPlaylistCriteria.css';

function InputPlaylistCriteria() {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  return (
    <div className="InputPlaylistCriteria">
      <header className="InputPlaylistCriteria-header">

        <p>The current time is {currentTime}.</p>
      </header>
    </div>
  );
}

export default InputPlaylistCriteria;