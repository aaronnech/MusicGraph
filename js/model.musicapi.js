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
