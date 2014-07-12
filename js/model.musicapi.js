//Load Genere and top Artist relate to that
jQuery.ajaxSettings.traditional = true;
var host = 'http://developer.echonest.com/api/v4/';
var apiKey =  'YTBBANYZHICTAFW2P';
var deferredSongs = null;
var allGenres = {};
var genreList = ['rock'];
var fullGenreList = [];
var player;

function loadTopArtists(genreName) {
    var url = host + 'genre/artists'
    $.getJSON(url, {api_key:apiKey, name:genreName },
        function(data) {
            var artists = data.response.artists;
            var list = $("#artist-list");
            list.empty();
            _.each(artists, function(artist, i) {
                var a = $("<a>").text(artist.name).attr('href', 'http://static.echonest.com/echotron/?id='+ artist.id);
                var li = $("<li>").append(a);
                list.append(li);
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
