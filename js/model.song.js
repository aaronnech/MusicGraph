function Song(songId) {

	var self = this;

	require(['$api/models'], function(models) {
		models.player.playTrack(models.Track.fromURI('spotify:track:3P6p25MvU3qnvWa8L7i5Lr'));
	});
	
	var fetchArtist = function(artistId, callback) {
		$.ajax({
			url: 'https://api.spotify.com/v1/artists/' + artistId,
			success: function(response) {
				callback(response);
			}
		});
	};
	
	var fetchRelatedSongs = function(artistId, callback) {
		api.getSong(name)
		$.ajax({
			url: 'https://api.spotify.com/v1/artists/' + artistId + '/related-artists',
			success: function(response) {
				callback(response);
			}
		});
	}

	var artist = fetchArtist()
	//list of related songs
	var relatedSongs = fetchRelatedSongs(artistId, callback)
	//list of youtube related videos 



}
