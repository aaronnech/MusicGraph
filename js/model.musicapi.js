//Load Genere and top Artist relate to that
jQuery.ajaxSettings.traditional = true;
var host = 'http://developer.echonest.com/api/v4/';
var apiKey =  'YTBBANYZHICTAFW2P';
var curSong = null;
var songTemplate = _.template($("#song-template").text());
var knownSongs = {};
var curGenre = null;
var allGenres = {};
var genreList = ['rock'];
var fullGenreList = [];
var player;

function chooseRandomGenre() {
    var genre = genreList[Math.floor(Math.random()*genreList.length)];
    document.location= '?genre=' + genre.name;
}

function getRandomFullGenre() {
    var genre = fullGenreList[Math.floor(Math.random()*fullGenreList.length)];
    return genre.name;
}

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

function loadSimilarGenres(genreName) {
    var url = host + 'genre/similar'
    $.getJSON(url, {api_key:apiKey, name:genreName },
        function(data) {
            var genres = data.response.genres;
            var list = $("#similar-genres");
            list.empty();
            if (genres.length > 0) {
                _.each(genres, function(genre, i) {
                    var a = $("<a>").text(genre.name).attr('href', '?genre='+genre.name);
                    var li = $("<li>").append(a).addClass('gna');
                    list.append(li);
                });
                $("#similars").show();
            } else {
                $("#similars").hide();
            }
        });
}

function loadTopSongs(genreName, preset) {
    info("");
    curStyle = preset.replace(/_/g, ' ');
    curStyle = curStyle.replace('-best', '');
    var url = host + 'playlist/static';
    $.getJSON(url, {api_key:apiKey, bucket:['tracks', 'id:spotify-WW'],
                    limit:true, type:"genre-radio",
                    results:12,
                    genre_preset:preset,
                    genre:genreName },
        function(data) {
            var songs = data.response.songs;
            curSongs = songs;
            var list = $("#song-list");
            list.empty();
            _.each(songs, function(song, i) {
                song.which = i;
                var adiv = $("<div>");
                adiv.attr('class', 'tadiv');
                song.adiv = adiv;
                list.append(adiv);
            });
            player.addSongs(songs, function(song) {
                song.adiv.html(getPlayer(song));
            });
        });
}

function urldecode(str) {
   return decodeURIComponent((str+'').replace(/\+/g, '%20'));
}

function setURL(genre) {
    var p = '?genre=' + genre;
    history.replaceState({}, document.title, p);
}

function savePlaylist() {
    info("Saving the playlist");
}


function loadGenreList() {
    var url = "http://developer.echonest.com/api/v4/genre/list";
    $.getJSON(url, {api_key:apiKey, results:2000, bucket:["description", "urls"]}, function(data) {
        var glist = $('#genre');
        var noDescriptionCount = 0;
        genreList = data.response.genres;
        _.each(data.response.genres, function(genre, i) {
            genre.which = i;
            allGenres[genre.name] = genre;
            var opt = $("<option>").attr('value', genre.name).text(genre.name);
            glist.append(opt);

            if (genre.description.length == 0) {
                noDescriptionCount += 1;
            } else {
                fullGenreList.push(genre);
            }
        });
        console.log("Genres with no description " + noDescriptionCount);
        $(".chzn-select").chosen().change(function() {
            newGenre();
        });
        processParams();
    });
}

function newGenre() {
    var genre = $("#genre").val();
    if (genre.length > 0) {
        document.location= '?genre=' + genre;
    }
}

function selectGenre(name) {
    $('#genre').val(name);
    $('#genre').trigger("liszt:updated");
}

function processParams() {
    var params = {};
    var q = document.URL.split('?')[1];
    if(q != undefined){
        q = q.split('&');
        for(var i = 0; i < q.length; i++){
            var pv = q[i].split('=');
            var p = pv[0];
            var v = pv[1];
            params[p] = urldecode(v);
        }
    }

    var genre = null;
    if ('genre' in params) {
        genre = params['genre'];
        if (! (genre in allGenres)) {
            genre = null;
        }
    }
    if (genre == null) {
        genre = getRandomFullGenre();
    }
    showGenre(genre);
}

// SPOTIFY API CODE

var getFirstArtist = function (query, callback) {
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

var getRelatedArtists = function (artistId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/artists/' + artistId + '/related-artists',
        success: function (response) {
            callback(response);
        }
    });
};

var getIndividualArtist = function (query, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: query,
            type: 'artist'
        },
        success: function (response) {
            var item = response.tracks.items[0];
            callback(item.id, item.name);
        }
    });
};


var getArtistTopTracks  = function (artistId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/artists/' + artistId + '/top-tracks?country=US',
        success: function (response) {
            callback(response);
        }
    });
};
