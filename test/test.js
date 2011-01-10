var spotify = require("../lib/main"),
    vows = require('vows'),
    assert = require('assert');

vows.describe('Spotify Metadata').addBatch({
    'Lookup': {
        '@ an URL': {
            'topic': function(){
                spotify.lookup("http://open.spotify.com/artist/43ZHCT0cAZBISjO8DG9PnE", this.callback);
            },
            'check artist name': function (error, id, type, response) {
                assert.equal(error, null);
                assert.equal(response.artist.name, "Elvis Presley");
            }
        },
        '@ an URL/2': {
            'topic': function(){
                spotify.lookup("open.spotify.com/artist/43ZHCT0cAZBISjO8DG9PnE", this.callback);
            },
            'check artist name': function (error, id, type, response) {
                assert.equal(error, null);
                assert.equal(response.artist.name, "Elvis Presley");
            }
        },
        '@ an invalid URL': {
            'topic': function(){
                spotify.lookup("open.spotify.com/artist/", this.callback);
            },
            'check if it there\'s an error': function (error, id, type, response) {
                assert.isNotNull(error);
            }
        },
        '@ an artist ID with options low details': {
            'topic': function(){
                spotify.lookup("4YrKBkKSVeqDamzBPWVnSJ", {
                    "type": "artist",
                    "detail": 0
                }, this.callback);
            },
            'are arguments correct? is response correct?': function(error, id, type, response){
                assert.isNull(error);
                assert.equal(id, "4YrKBkKSVeqDamzBPWVnSJ");
                assert.equal(type, "artist");
                assert.equal(response.artist.name, "Basement Jaxx");
                assert.equal(response.artist.href, "spotify:artist:4YrKBkKSVeqDamzBPWVnSJ");
            }
        },
        '@ an album ID with options low details': {
            'topic': function(){
                spotify.lookup("7fh6U3pYDTFZBjLaF2tyTp", {
                    "type": "album",
                    "detail": 0
                }, this.callback);
            },
            'are arguments correct? is response correct?': function(error, id, type, response){
                assert.isNull(error);
                assert.equal(id, "7fh6U3pYDTFZBjLaF2tyTp");
                assert.equal(type, "album");
                assert.equal(response.album.name, "Nevermind");
                assert.equal(response.album.artist, "Nirvana");
                assert.equal(response.album.released, '1991');
            }
        },
        '@ a track ID with options': {
            'topic': function(){
                spotify.lookup("6rxEjkoar48SssZePbtb2x", {
                    type: "track",
                    detail: 1
                }, this.callback);
            },
            'are arguments correct? is response correct?': function(error, id, type, response){
                assert.isNull(error);
                assert.equal(id, "6rxEjkoar48SssZePbtb2x");
                assert.equal(type, "track");
                assert.equal(response.track.name, "Crystalised");
                assert.equal(response.track.artists[0].name, "The xx");
                assert.equal(response.track.artists[0].href, "spotify:artist:54mPD9TeybZmZL7O7dbIys");
                assert.equal(response.track.album.name, 'xx');
                assert.equal(response.track.album.released, '2009');
                assert.equal(response.track.album.href, 'spotify:album:2nXJkqkS1tIKIyhBcFMmwz');
            }
        },
        '@ spotify artist ID': {
            'topic': function(){
                spotify.lookup("spotify:artist:4YrKBkKSVeqDamzBPWVnSJ", this.callback);
            },
            'are arguments correct? is response correct?': function(error, id, type, response){
                assert.isNull(error);
                assert.equal(id, "4YrKBkKSVeqDamzBPWVnSJ");
                assert.equal(type, "artist");
                assert.equal(response.artist.name, "Basement Jaxx");
                assert.equal(response.artist.href, "spotify:artist:4YrKBkKSVeqDamzBPWVnSJ");
            }
        },
        '@ spotify album ID': {
            'topic': function(){
                spotify.lookup("spotify:album:47NyOhTgkhfiFXd0DKrxig", this.callback);
            },
            'are arguments correct? is response correct?': function(error, id, type, response){
                assert.isNull(error);
                assert.equal(id, "47NyOhTgkhfiFXd0DKrxig");
                assert.equal(type, "album");
                assert.equal(response.album.name, "A Boy Named Johnny");
                assert.equal(response.album.artist, "Johnny Cash");
                assert.equal(response.album.released, '2010');
            }
        },
        '@ spotify track ID': {
            'topic': function(){
                spotify.lookup("spotify:track:6rxEjkoar48SssZePbtb2x", {
                    type: "track",
                    detail: 1
                }, this.callback);
            },
            'are arguments correct? is response correct?': function(error, id, type, response){
                assert.isNull(error);
                assert.equal(id, "6rxEjkoar48SssZePbtb2x");
                assert.equal(type, "track");
                assert.equal(response.track.name, "Crystalised");
                assert.equal(response.track.artists[0].name, "The xx");
                assert.equal(response.track.artists[0].href, "spotify:artist:54mPD9TeybZmZL7O7dbIys");
                assert.equal(response.track.album.name, 'xx');
                assert.equal(response.track.album.released, '2009');
                assert.equal(response.track.album.href, 'spotify:album:2nXJkqkS1tIKIyhBcFMmwz');
            }
        }
    },

    'Search': {
        'try search': {
            'topic': function(){
                spotify.search("Nirvana", this.callback);
            },
            'is returned something': function(error, results){
                //assert.equal(results.length, 3);
                for(var i=0;i<results.track.length;i++){
                    console.log(results.track[i])
                }
                /*
                assert.equal(results.artist, 100);
                assert.equal(results.album, 100);
                assert.equal(results.track, 100);*/
            }
        }
    }
}).run();
/*
spotify.searchAlbum("Nevermind", function(){console.log(arguments)});
spotify.searchArtist("Nirvana", function(){console.log(arguments)});
spotify.searchTrack("About a Girl", function(){console.log(arguments)});*/