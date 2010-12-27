var spotify = require("../lib/main").SpotifyMetadata;

var callback = function(){
    console.log(arguments);
}

//spotify.lookup();
//spotify.lookup("4YrKBkKSVeqDamzBPWVnSJ", "artist");
spotify.lookup("7tEDqanTZ8NWxV7zzqth3m", function(){console.log('end')});
spotify.lookup("7fh6U3pYDTFZBjLaF2tyTp", {
    "type": "album",
    "detail": 0
}, callback);
spotify.lookup("6NmXV4o6bmp704aPGyTVVG", {
    type: "track",
    detail: 2
}, callback)
//spotify.search("music");
spotify.lookup("http://open.spotify.com/artist/43ZHCT0cAZBISjO8DG9PnE", callback);
//spotify.lookup("spotify:album:47NyOhTgkhfiFXd0DKrxig", callback);