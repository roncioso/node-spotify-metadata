var EventEmitter = require('events').EventEmitter,
    request = require('request');

var detailMap = {
    "artist": "album",
    "album": "track"
}

var SpotifyMeta = function(){}

SpotifyMeta.prototype.lookup = function(id, options, cb){

    if(!id){
        throw new Error("Nothing to parse...");
    }

    var opts = {
        id: id,
        reqID: "",
        type: options.type || "",
        detail: "",
        detailLevel: options.detail || 0,
        callback: cb || function(){},
        detailMap: {
            "artist": "album",
            "album": "track"
        }
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
    if(opts.type){
        opts.reqID = "spotify:"+opts.type+":"+opts.id;
    }

    //TODO refactor this
    if(opts.detailLevel && opts.detailMap[opts.type]){
        opts.detail += "&extras="+opts.detailMap[opts.type];
        if(opts.detailLevel > 1) opts.detail += "detail";
        opts.reqID += opts.detail;
    }

    var r = request({
        uri: "http://ws.spotify.com/lookup/1/.json?uri="+opts.reqID
    }, function(e,r,b){
        opts.callback(opts.id,opts.type,b);
    })
}

SpotifyMeta.prototype._isOpenSpotifyUrl = function(data){
    return (data.match(/http:\/\/open.spotify.com\//gi)) ? true : false;
}

SpotifyMeta.prototype._parseUrl = function(url){
    var u = url.replace(/http:\/\/open.spotify.com\//gi, "").split("/");
    return {
        type: u[0],
        id: u[1]
    }
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
