function loadTopArtists(genreName, callback) {
    var url = 'http://developer.echonest.com/api/v4/genre/artists'
    var apiKey = 'YTBBANYZHICTAFW2P';
    $.getJSON(url, {api_key:apiKey,results:10,name:genreName},
        function(data) {
            var results = [];
            for (var i = 0; i < data.response.artists.length; i++) {
                results.push(new Artist(data.response.artists[i]));
            }
            callback(results);
        });
};

// function loadSimilarGenres(genreName) {
//     var url = host + 'genre/similar'
//     $.getJSON(url, {api_key:apiKey, name:genreName },
//         function(data) {
//             var genres = data.response.genres;
//         });
//     $.each(genres, function(genre, i) {
//                     var a = $("<a>").text(genre.name).attr('href', '?genre='+genre.name);
//                     console.log(a);
//         });
// }

//// Spotify API ////

var getRelatedArtists = function (artistId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/artists/' + artistId + '/related-artists',
        success: function (response) {
            var results = [];
            for (var i = 0; i < response.artists.length; i++) {
                results.push(new Artist(response.artists[i]));
            }
            callback(results);
        }
    });
};

var getIndividualArtist = function (artistId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/artists/' + artistId,
        success: function (response) {
            var result = new Artist(response);
            callback(result);
        }
    });
};

var getArtistTopTracks = function (artistId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/artists/' + artistId + '/top-tracks?country=US',
        success: function (response) {
            var results = [];
            for (var i = 0; i < response.tracks.length; i++) {
                results.push(new Song(response.tracks[i]));
            }
            callback(results);
        }
    });
};
