function Song(api_obj, songId) {
	var self = this;

	/* Instantiate the global sp object; include models & views */
	var sp = getSpotifyApi(1);
	var models = sp.require("sp://import/scripts/api/models");
	var views = sp.require("sp://import/scripts/api/views");
	 
	/* Create an array of tracks from the user's library */
	var track = models.Track.fromURI('spotify:track:7DJI0fg4dzBJk31sEmn6Zk');
	 
	/* Create a temporary playlist for the song */
	var playlist = new models.Playlist();
	playlist.add(track);
	var playerView = new views.Player();
	playerView.track = null; // Don't play the track right away
	playerView.context = playlist;
	 
	/* Pass the player HTML code to the #player <div /> */
	$('#player').append(playerView.node);

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