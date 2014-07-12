/**
 * @fileOverview Communicates and manages local state through the HTML5
 *    LocalStorage object.
 */
function State() {
	var self = this;

	/**
	 * Checks to see if a playlist state has been saved
	 * @return {Boolean} true if it has, false otherwise
	 */
	self.isSaved = function() {
		return localStorage.getItem('playlist') != null;
	};


	/**
	 * Given a playlist, attempts to restore its' songs from storage
	 */
	self.restoreSongs = function(playList) {
		var protoSongs = JSON.parse(JSON.parse(localStorage.getItem('playlist')));

		var songs = protoSongs.map(function(protoSong) {
			return new Song(protoSong);
		});
		if(songs) {
			playList.songs(songs);
		} else {
			if(self.isSaved)
				localStorage.removeItem('playlist');
		}
	};


	/**
	 * Given a playlist, attempts to save its' songs to storage
	 */
	self.saveSongs = function(playList) {
		var protoSongs = JSON.stringify(playList.songs().map(function(song) {
			return song.track;
		}));
		localStorage.setItem('playlist', JSON.stringify(protoSongs));
	};


	/**
	 * Given a view model, and saved actions to storage, we will execute on those
	 * actions.
	 */
	self.doLocalActions = function(vm) {
		var hash = location.hash.replace(/#/g, '');
		var all = hash.split('&');
		var args = {};
		all.forEach(function(keyvalue) {
			var idx = keyvalue.indexOf('=');
			var key = keyvalue.substring(0, idx);
			var val = keyvalue.substring(idx + 1);
			args[key] = val;
		});
		if(localStorage.getItem('make-playlist') != null && args['access_token']) {
			localStorage.removeItem('make-playlist');
			vm.setAccessToken(args['access_token']);
			vm.makePlaylist();
		}
	};

}