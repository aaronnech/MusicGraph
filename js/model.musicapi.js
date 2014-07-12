/**
 * @fileOverview Music Spotify API interaction object. This object is responsible for
 * all communication with Spotify and EchoNest APIs.
 */

function MusicAPI(token) {
    var self = this;

    var accessToken = token || '';

    var CLIENT_ID = '510822911bb745649354e6784b47de76';
    var REDIRECT_URL = 'http://musicgraph.in/index.html';


    /**
     * Helper function to perform a login (sets an action and value to localstorage
     * so our application can act on it when it returns)
     */
    var login = function(action, value) {
        var url = 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
            '&response_type=token' +
            '&scope=playlist-read-private%20playlist-modify%20playlist-modify-private' +
            '&redirect_uri=' + encodeURIComponent(REDIRECT_URL);
        if(action)
            localStorage.setItem(action, value);
        window.location = url;
    };


    /**
     * Gets a spotify username
     */
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
    };


    /**
     * Sets a spotify access token
     */
    self.setToken = function(newToken) {
        accessToken = newToken;
    };


    /**
     * Creates a spotify playlist
     */
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


    /**
     * Adds tracks to a spotify playlist
     */
    self.addTracksToPlaylist = function(username, playlist, tracks, callback) {
        var url = 'https://api.spotify.com/v1/users/' + username +
            '/playlists/' + playlist +
            '/tracks'; // ?uris='+encodeURIComponent(tracks.join(','));
        $.ajax(url, {
            method: 'POST',
            data: JSON.stringify(tracks),
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
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


    /**
     * Makes a spotify playlist out of this application's playlist
     */
    self.makePlaylist = function(playList, name) {
        if(accessToken) {
            self.getUsername(function(username) {
                self.createPlaylist(username, name, function(playlistHandle) {
                    self.addTracksToPlaylist(username, playlistHandle, playList.getTracks(), function() {
                        $('.alert-spotify-correct').fadeIn('slow').delay(500).fadeOut('slow');
                    });
                });
            });
        } else { // Not authenticated!
            login('make-playlist', name);
        }
    };


    /**
     * Gets the artists from a genre
     */
    self.getArtists = function(genreName, callback) {
        var url = 'http://developer.echonest.com/api/v4/artist/search';
        var apiKey = 'YTBBANYZHICTAFW2P';
        var numberOfResults = 10;
        var sort = ['familiarity-asc',
                    'hotttnesss-asc',
                    'familiarity-desc',
                    'hotttnesss-desc',
                    'artist_start_year-asc',
                    'artist_start_year-desc',
                    'artist_end_year-asc',
                    'artist_end_year-desc'];
        sort = sort[Math.floor(Math.random()*sort.length)];

        $.getJSON(url, {api_key : apiKey, results : numberOfResults, format : 'json', genre : genreName, sort : sort},
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


    /**
     * Searches artists from a query name
     */
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


    /**
     * Gets related artists for an artistId
     */
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


    /**
     * Gets the individual artist record for an artist id
     */
    self.getIndividualArtist = function(artistId, callback) {
        $.ajax({
            url: 'https://api.spotify.com/v1/artists/' + artistId,
            success: function(response) {
                var result = new Artist(response);
                callback(result);
            }
        });
    };


    /**
     * Gets an artist's top tracks.
     */
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


/**
 * Because we had to execute multiple parallel requests and wait for all of them to
 * finish before executing a callback, this ugly stepchild was born.
 *
 * A RequestQueue takes a parameters a expected number of request completions,
 * and a callback to execute when they are all finished.
 *
 * You then instead of passing a usual callback to a request, pass a middleman
 * function generated as a closure of this function which will increment a counter.
 */
function RequestQueue(numberOfRequests, finished) {
    var self = this;
    self.numberOfRequests = numberOfRequests;
    self.done = 0;

    /**
     * Helper function to check if the number of requests have been met
     */
    var checkComplete = function() {
        if(self.done == self.numberOfRequests) {
            finished();
        }
    }


    /**
     * Called in place of a usual callback. The callback passed
     * is the usual callback.
     */
    self.enqueue = function(callback) {
        return function(parameter) {
            callback(parameter);
            self.done++;
            checkComplete();
        }
    };
}
