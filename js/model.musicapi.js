function MusicAPI(token, username) {
    var self = this;

    var accessToken = token || '';

    var CLIENT_ID = '510822911bb745649354e6784b47de76';
    var REDIRECT_URL = 'http://www.musicgraph.in/index.html';

    var login = function(action) {
        var url = 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
            '&response_type=token' +
            '&scope=playlist-read-private%20playlist-modify%20playlist-modify-private' +
            '&redirect_uri=' + encodeURIComponent(REDIRECT_URL);
        if(action)
            localStorage.setItem(action, 'SET');
        var w = window.open(url, 'Spotify Login', 'WIDTH=400,HEIGHT=500');
    };

    self.getUsername = function(callback) {
        var url = 'https://api.spotify.com/v1/me';
        $.ajax(url, {
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            },
            success: function(r) {
                callback(r.id);
            },
            error: function(r) {
                callback(null);
            }
        });
    }

    self.createPlaylist = function(username, name, callback) {
        var url = 'https://api.spotify.com/v1/users/' + username +
            '/playlists';
        $.ajax(url, {
            method: 'POST',
            data: JSON.stringify({
                'name': name,
                'public': false
            }),
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            success: function(r) {
                callback(r.id);
            },
            error: function(r) {
                callback(null);
            }
        });
    }

    self.addTracksToPlaylist = function(username, playlist, tracks, callback) {
        var url = 'https://api.spotify.com/v1/users/' + username +
            '/playlists/' + playlist +
            '/tracks'; // ?uris='+encodeURIComponent(tracks.join(','));
        $.ajax(url, {
            method: 'POST',
            data: JSON.stringify(tracks),
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + g_access_token,
                'Content-Type': 'application/json'
            },
            success: function(r) {
                console.log('add track response', r);
                callback(r.id);
            },
            error: function(r) {
                callback(null);
            }
        });
    }

    self.makePlaylist = function(playList, name) {
        if(accessToken) {
            self.getUsername(function(username) {
                self.createPlaylist(username, name, function(playlistHandle) {
                    self.addTracksToPlaylist(username, playlistHandle, playList.getTracks(), function() {
                        console.log('DONE!');
                    });
                });
            });
        } else {
            login();
        }
    };

    self.getArtists = function(genreName, callback) {
        var url = 'https://developer.echonest.com/api/v4/genre/artists';
        var apiKey = 'YTBBANYZHICTAFW2P';
        var numberOfResults = 10;

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
