function MusicAPI() {
    var self = this;

    self.getArtists = function(genreName, callback) {
        var url = 'https://developer.echonest.com/api/v4/genre/artists';
        var apiKey = 'YTBBANYZHICTAFW2P';
        var numberOfResults = 15;

        $.getJSON(url, {api_key : apiKey, results : numberOfResults, name : genreName},
            function(data) {
                var results = [];
                var reqQueue = new RequestQueue(numberOfResults, function() {
                    callback(results);
                });
                for (var i = 0; i < data.response.artists.length; i++) {
                    self.searchArtist(data.response.artists[i].name, reqQueue.enqueue(function(artist) {
                        results.push(new Artist(artist));
                    }));
                }
            });
    };

    self.searchArtist = function(query, callback) {
        $.ajax({
            url: 'https://api.spotify.com/v1/search',
            data: {
                q: query,
                type: 'artist'
            },
            success: function(response) {
                var item = response.artists.items[0];
                callback(item);
            }
        });
    };

    // self.loadSimilarGenres = function(genreName) {
    //     var apiKey = 'YTBBANYZHICTAFW2P';
    //     var url = 'https://developer.echonest.com/api/v4/genre/similar';
    //     $.getJSON(url, {api_key:apiKey, name:genreName },
    //         function(data) {
    //             var genres = data.response.genres;
    //             console.log(genres);
    //         });
    // }

    self.getRelatedArtists = function(artistId, callback) {
        $.ajax({
            url: 'https://api.spotify.com/v1/artists/' + artistId + '/related-artists',
            success: function(response) {
                var results = [];
                for (var i = 0; i < response.artists.length; i++) {
                    results.push(new Artist(response.artists[i]));
                }
                callback(results);
            }
        });
    };

    self.getIndividualArtist = function(artistId, callback) {
        $.ajax({
            url: 'https://api.spotify.com/v1/artists/' + artistId,
            success: function(response) {
                var result = new Artist(response);
                callback(result);
            }
        });
    };

    self.getArtistTopTracks = function(artistId, callback) {
        $.ajax({
            url: 'https://api.spotify.com/v1/artists/' + artistId + '/top-tracks?country=US',
            success: function(response) {
                var results = [];
                for (var i = 0; i < response.tracks.length; i++) {
                    results.push(new Song(response.tracks[i]));
                }
                callback(results);
            }
        });
    };
};

function RequestQueue(numberOfRequests, finished) {
    var self = this;
    self.numberOfRequests = numberOfRequests;
    self.done = 0;

    var checkComplete = function() {
        if(self.done == self.numberOfRequests) {
            finished();
        }
    }

    self.enqueue = function(callback) {
        return function(parameter) {
            callback(parameter);
            self.done++;
            checkComplete();
        }
    };
}

player_obj.load('tracks').done(function(po){
    models.Playlist.create(player_obj.name).done(function(new_playlist) {
        new_playlist.load('tracks').done(function(new_playlist_tracks) {
            po.tracks.snapshot().done(function(tracksnapshot){
                new_playlist_tracks.tracks.add(tracksnapshot.toArray());
            });
        });
    });
});

var player_obj = models.Playlist.fromURI('spotify:user:kyliemoden:playlist:7A5y9BA7dxQfOdEoN8igbY');
