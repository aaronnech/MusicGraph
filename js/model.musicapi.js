//Load Genere and top Artist relate to that
jQuery.ajaxSettings.traditional = true;
var host = 'http://developer.echonest.com/api/v4/';
var apiKey =  'YTBBANYZHICTAFW2P';
var knownSongs = {};
var curGenre = null;
var curSong = null;
var allGenres = {};
var genreList = ['rock'];
var fullGenreList = [];
var player;


function loadGenreList() {
    var url = "http://developer.echonest.com/api/v4/genre/list";
    $.getJSON(url, {api_key:apiKey, results:2000, bucket:["description", "urls"]}, function(data) {
           genreList = data.response.genres;
        _.each(data.response.genres, function(genre, i) {
            genre.which = i;
            allGenres[genre.name] = genre;
            fullGenreList.push(genre);
            
        });
        processParams();
    });
}



function loadTopArtists(genreName) {
    var url = host + 'genre/artists'
    $.getJSON(url, {api_key:apiKey, name:genreName },
        function(data) {
            var artists = data.response.artists;
            list.empty();
            _.each(artists, function(artist, i) {
                var a = $.text(artist.name).attr('href', 'http://static.echonest.com/echotron/?id='+ artist.id);
            });
        });
}

function loadSimilarGenres(genreName) {
    var url = host + 'genre/similar'
    $.getJSON(url, {api_key:apiKey, name:genreName },
        function(data) {
            var genres = data.response.genres;
            list.empty();
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
            _.each(songs, function(song, i) {
                song.which = i;
                song.adiv = adiv;
                list.append(adiv);
            });

        });
}



// find template and compile it
var templateSource = document.getElementById('results-template').innerHTML,
    template = Handlebars.compile(templateSource),
    resultsPlaceholder = document.getElementById('results');

var fetchRelatedArtists = function (artistId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/artists/' + artistId + '/related-artists',
        success: function (response) {
            callback(response);
        }
    });
};

var searchArtist = function (query, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'artist'
        },
        success: function (response) {
            var item = response.artists.items[0];
            callback(item.id, item.name);
        }
    });
};

document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var artistName = document.getElementById('query').value;
    searchArtist(artistName, function(id, foundName) {
        fetchRelatedArtists(id, function(relatedArtists) {
            relatedArtists.artistName = foundName;
            resultsPlaceholder.innerHTML = template(relatedArtists);
        });
    });
}, false);
