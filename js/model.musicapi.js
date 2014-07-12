jQuery.ajaxSettings.traditional = true;
var host = 'http://developer.echonest.com/api/v4/';
var apiKey = 'YTBBANYZHICTAFW2P';
var knownSongs = {};
var curGenre = null;
var curSong = null;
var allGenres = {};
var genreList = ['rock'];
var fullGenreList = [];
var player;

function showGenre(genreName) {
    console.log('showing genre', genreName);
    curGenre = genreName;
    var title = genreName;
    selectGenre(curGenre);
    loadSimilarGenres(genreName);
    loadTopArtists(genreName);
    loadTopSongs(genreName, 'core-best');
}

function loadGenre() {
    var url = "http://developer.echonest.com/api/v4/genre/list";
    $.getJSON(url, {api_key:apiKey, results:2000, bucket:[]}, function(data) {
                genreList = data.response.genres;
            each(data.response.genres, function(genre, i) {
            genre.which = i;
            allGenres[genre.name] = genre;
            allGenres[genre.name] = genre;
           fullGenreList.push(genre);
    });
});
}

function selectGenre(name) {
    $('#genre').val(name);
    $('#genre').trigger("liszt:updated");
}


function loadTopArtists(genreName) {
    $.getJSON(url, {api_key:apiKey, name:genreName },
        function(data) {
            var artists = data.response.artists;
            each(artists, function(artist, i) {
                var a = 'http://static.echonest.com/echotron/?id='+ artist.id;
            });
        });
}

function loadSimilarGenres(genreName) {
    $.getJSON(url, {api_key:apiKey, name:genreName },
        function(data) {
            var genres = data.response.genres;
        });
}

function loadTopSongs(genreName, preset) {
    info("");
    $.getJSON(url, {api_key:apiKey, bucket:['tracks', 'id:spotify-WW'],
                    limit:true, type:"genre-radio",
                    results:12,
                    genre_preset:preset,
                    genre:genreName },
        function(data) {
            var songs = data.response.songs;
            curSongs = songs;

        });
}

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
