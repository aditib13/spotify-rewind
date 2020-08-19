const genreList = [
    { value: "all genres", label: "all genres", id: "all genres" },
    { value: "acoustic", label: "acoustic", id: "acoustic" }, 
    { value: "afrobeat", label: "afrobeat", id: "afrobeat" }, 
    { value: "alt-rock", label: "alt-rock", id: "alt-rock" }, 
    { value: "alternative", label: "alternative", id: "alternative" }, 
    { value: "ambient", label: "ambient", id: "ambient" }, 
    { value: "anime", label: "anime", id: "anime" }, 
    { value: "black-metal", label: "black-metal", id: "black-metal" }, 
    { value: "bluegrass", label: "bluegrass", id: "bluegrass" }, 
    { value: "blues", label: "blues", id: "blues" }, 
    { value: "bollywood", label: "bollywood", id: "bollywood" },
    { value: "bossanova", label: "bossanova", id: "bossanova" }, 
    { value: "brazil", label: "brazil", id: "brazil" }, 
    { value: "breakbeat", label: "breakbeat", id: "breakbeat" }, 
    { value: "british", label: "british", id: "british" }, 
    { value: "cantopop", label: "cantopop", id: "cantopop" }, 
    { value: "chicago-house", label: "chicago-house", id: "chicago-house" }, 
    { value: "children", label: "children", id: "children" }, 
    { value: "chill", label: "chill", id: "chill" }, 
    { value: "classic rock", label: "classic rock", id: "classic rock" },
    { value: "classical", label: "classical", id: "classical" }, 
    { value: "club", label: "club", id: "club" }, 
    { value: "comedy", label: "comedy", id: "comedy" }, 
    { value: "country", label: "country", id: "country" }, 
    { value: "dance", label: "dance", id: "dance" }, 
    { value: "dancehall", label: "dancehall", id: "dancehall" }, 
    { value: "death-metal", label: "death-metal", id: "death-metal" }, 
    { value: "deep-house", label: "deep-house", id: "deep-house" }, 
    { value: "detroit-techno", label: "detroit-techno", id: "detroit-techno" }, 
    { value: "disco", label: "disco", id: "disco" }, 
    { value: "disney", label: "disney", id: "disney" }, 
    { value: "drum-and-bass", label: "drum-and-bass", id: "drum-and-bass" }, 
    { value: "dub", label: "dub", id: "dub" }, 
    { value: "dubstep", label: "dubstep", id: "dubstep" }, 
    { value: "edm", label: "edm", id: "edm" }, 
    { value: "electro", label: "electro", id: "electro" }, 
    { value: "electronic", label: "electronic", id: "electronic" }, 
    { value: "emo", label: "emo", id: "emo" }, 
    { value: "folk", label: "folk", id: "folk" }, 
    { value: "forro", label: "forro", id: "forro" }, 
    { value: "french", label: "french", id: "french" }, 
    { value: "funk", label: "funk", id: "funk" }, 
    { value: "garage", label: "garage", id: "garage" }, 
    { value: "german", label: "german", id: "german" }, 
    { value: "gospel", label: "gospel", id: "gospel" }, 
    { value: "goth", label: "goth", id: "goth" }, 
    { value: "grindcore", label: "grindcore", id: "grindcore" }, 
    { value: "groove", label: "groove", id: "groove" }, 
    { value: "grunge", label: "grunge", id: "grunge" }, 
    { value: "guitar", label: "guitar", id: "guitar" }, 
    { value: "happy", label: "happy", id: "happy" }, 
    { value: "hard-rock", label: "hard-rock", id: "hard-rock" }, 
    { value: "hardcore", label: "hardcore", id: "hardcore" }, 
    { value: "hardstyle", label: "hardstyle", id: "hardstyle" }, 
    { value: "heavy-metal", label: "heavy-metal", id: "heavy-metal" }, 
    { value: "hip-hop", label: "hip-hop", id: "hip-hop" }, 
    { value: "holidays", label: "holidays", id: "holidays" }, 
    { value: "honky-tonk", label: "honky-tonk", id: "honky-tonk" }, 
    { value: "house", label: "house", id: "house" }, 
    { value: "idm", label: "idm", id: "idm" }, 
    { value: "indian", label: "indian", id: "indian" }, 
    { value: "indie", label: "indie", id: "indie" }, 
    { value: "indie-pop", label: "indie-pop", id: "indie-pop" }, 
    { value: "industrial", label: "industrial", id: "industrial" }, 
    { value: "instrumental", label: "instrumental", id: "instrumental" }, 
    { value: "iranian", label: "iranian", id: "iranian" }, 
    { value: "j-dance", label: "j-dance", id: "j-dance" }, 
    { value: "j-idol", label: "j-idol", id: "j-idol" }, 
    { value: "j-pop", label: "j-pop", id: "j-pop" }, 
    { value: "j-rock", label: "j-rock", id: "j-rock" }, 
    { value: "jazz", label: "jazz", id: "jazz" }, 
    { value: "k-pop", label: "k-pop", id: "k-pop" }, 
    { value: "kids", label: "kids", id: "kids" }, 
    { value: "latin", label: "latin", id: "latin" }, 
    { value: "latino", label: "latino", id: "latino" }, 
    { value: "malay", label: "malay", id: "malay" }, 
    { value: "mandopop", label: "mandopop", id: "mandopop" }, 
    { value: "metal", label: "metal", id: "metal" }, 
    { value: "metal-misc", label: "metal-misc", id: "metal-misc" }, 
    { value: "metalcore", label: "metalcore", id: "metalcore" }, 
    { value: "minimal-techno", label: "minimal-techno", id: "minimal-techno" }, 
    { value: "movies", label: "movies", id: "movies" }, 
    { value: "mpb", label: "mpb", id: "mpb" }, 
    { value: "new-age", label: "new-age", id: "new-age" }, 
    { value: "new-release", label: "new-release", id: "new-release" }, 
    { value: "opera", label: "opera", id: "opera" }, 
    { value: "pagode", label: "pagode", id: "pagode" }, 
    { value: "party", label: "party", id: "party" }, 
    { value: "philippines-opm", label: "philippines-opm", id: "philippines-opm" }, 
    { value: "piano", label: "piano", id: "piano" }, 
    { value: "pop", label: "pop", id: "pop" }, 
    { value: "pop-film", label: "pop-film", id: "pop-film" }, 
    { value: "post-dubstep", label: "post-dubstep", id: "post-dubstep" }, 
    { value: "power-pop", label: "power-pop", id: "power-pop" }, 
    { value: "progressive-house", label: "progressive-house", id: "progressive-house" }, 
    { value: "psych-rock", label: "psych-rock", id: "psych-rock" }, 
    { value: "punk", label: "punk", id: "punk" }, 
    { value: "punk-rock", label: "punk-rock", id: "punk-rock" }, 
    { value: "r-n-b", label: "r-n-b", id: "r-n-b" }, 
    { value: "rainy-day", label: "rainy-day", id: "rainy-day" }, 
    { value: "rap", label: "rap", id: "rap" }, 
    { value: "reggae", label: "reggae", id: "reggae" }, 
    { value: "reggaeton", label: "reggaeton", id: "reggaeton" }, 
    { value: "road-trip", label: "road-trip", id: "road-trip" }, 
    { value: "rock", label: "rock", id: "rock" }, 
    { value: "rock-n-roll", label: "rock-n-roll", id: "rock-n-roll" }, 
    { value: "rockabilly", label: "rockabilly", id: "rockabilly" }, 
    { value: "romance", label: "romance", id: "romance" }, 
    { value: "sad", label: "sad", id: "sad" }, 
    { value: "salsa", label: "salsa", id: "salsa" }, 
    { value: "samba", label: "samba", id: "samba" }, 
    { value: "sertanejo", label: "sertanejo", id: "sertanejo" }, 
    { value: "show-tunes", label: "show-tunes", id: "show-tunes" }, 
    { value: "singer-songwriter", label: "singer-songwriter", id: "singer-songwriter" }, 
    { value: "ska", label: "ska", id: "ska" }, 
    { value: "sleep", label: "sleep", id: "sleep" }, 
    { value: "songwriter", label: "songwriter", id: "songwriter" }, 
    { value: "soul", label: "soul", id: "soul" }, 
    { value: "soundtracks", label: "soundtracks", id: "soundtracks" }, 
    { value: "spanish", label: "spanish", id: "spanish" }, 
    { value: "study", label: "study", id: "study" }, 
    { value: "summer", label: "summer", id: "summer" }, 
    { value: "swedish", label: "swedish", id: "swedish" }, 
    { value: "synth-pop", label: "synth-pop", id: "synth-pop" }, 
    { value: "tango", label: "tango", id: "tango" }, 
    { value: "techno", label: "techno", id: "techno" }, 
    { value: "trance", label: "trance", id: "trance" }, 
    { value: "trip-hop", label: "trip-hop", id: "trip-hop" }, 
    { value: "turkish", label: "turkish", id: "turkish" }, 
    { value: "work-out", label: "work-out", id: "work-out" }, 
    { value: "world-music", label: "world-music", id: "world-music" }
  ]
  
export { genreList };