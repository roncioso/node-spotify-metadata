var request = require('request');

var SpotifyMeta = function(){}

SpotifyMeta.prototype._detailsMap = {
    "artist": "album",
    "album": "track"
};

SpotifyMeta.prototype.lookup = function(id, options, cb){

    if(!id){
        throw new Error("Nothing to parse...");
    }

    options = options || {};

    var opts = {
        id: id,
        reqID: "",
        type: options.type || "",
        detail: "",
        detailLevel: options.detail || 0,
        callback: cb || function(){}
    }

    //Adjust callback
    if(typeof options === "function"){
        opts.callback = options
    }

    //Is id an openspotify uri?
    if(this._isOpenSpotifyUrl(id)){
        var parsedUrl = this._parseUrl(id);
        opts.type = parsedUrl["type"];
        opts.id = parsedUrl["id"];
    }

    if(this._isSpotifyInternalUrl(id)){
        var splittedUrl = id.split(":");
        opts.type = splittedUrl[1];
        opts.id = splittedUrl[2];
    }

    if(!opts.type || !opts.id){
        return opts.callback("ERROR! not a valid url", opts.id, opts.type, null);
    }

    opts.reqID = "spotify:"+opts.type+":"+opts.id;

    if(opts.detailLevel && this._detailsMap[opts.type]){
        opts.detail += "&extras="+opts.detailMap[opts.type];
        if(opts.detailLevel > 1) opts.detail += "detail";
        opts.reqID += opts.detail;
    }

    var self = this;
    var r = request({
        uri: "http://ws.spotify.com/lookup/1/.json?uri="+opts.reqID
    }, function(error, r, response){
        if(!error){
            response = JSON.parse(response);
            opts.callback(null, opts.id, opts.type, response);
        } else {
            return opts.callback("ERROR! something went wrong", opts.id, opts.type, null);
        }
    })
}

SpotifyMeta.prototype._isOpenSpotifyUrl = function(data){
    return (data.match(/open.spotify.com\/(.*)\/(.*)/gi)) ? true : false;
}

SpotifyMeta.prototype._isSpotifyInternalUrl = function(data){
    return (data.match(/spotify:(.*):(.*)/gi)) ? true : false;
}

SpotifyMeta.prototype._parseUrl = function(url){
    var u = url.replace(/(http:\/\/)?open.spotify.com\//gi, "").split("/");
    return {
        type: u[0],
        id: u[1]
    }
}

SpotifyMeta.prototype.searchArtist = function(q, cb){
    this._singleSearch(q, "artist", cb);
}

SpotifyMeta.prototype.searchAlbum = function(q, cb){
    this._singleSearch(q, "album", cb);
}

SpotifyMeta.prototype.searchTrack = function(q, cb){
    this._singleSearch(q, "track", cb);
}

SpotifyMeta.prototype._singleSearch = function(q, type, cb){
    q = encodeURI(q);
    request({
        uri: "http://ws.spotify.com/search/1/"+type+".json?q="+type+":"+q
    }, function(e,r,b){
        b = JSON.parse(b);
        cb(b[type+"s"][0]);
    });
}

SpotifyMeta.prototype.search = function(query){
    var results = [],
        counter = 0,
        interval;

    var r1 = request({
        uri: "http://ws.spotify.com/search/1/album.json?q=album:"+query
    }, function(e,r,b){
        b = JSON.parse(b);
        results.push(b.albums);
        counter++;
    });

    var r2 = request({
        uri: "http://ws.spotify.com/search/1/track.json?q=track:"+query
    }, function(e,r,b){
        b = JSON.parse(b);
        results.push(b.tracks)
        counter++;
    });

    var r3 = request({
        uri: "http://ws.spotify.com/search/1/artist.json?q=artist:"+query
    }, function(e,r,b){
        b = JSON.parse(b);
        results.push(b.artists)
        counter++;
    });

    interval = setInterval(function(){
        if(results.length==3){
            var h = "<ul>";
            for(var i=0;i<results.length;i++){
                for(var q=0;q<results[i].length;q++){
                    h += "<li>"+results[i][q].name+"</li>";
                }
                h += "<li>--- Total: "+results[i].length+"</li>";
            }
            h += "</ul>"
            console.log(h);
            clearInterval(interval);
        }
    }, 100)

}

module.exports.SpotifyMetadata = new SpotifyMeta();
