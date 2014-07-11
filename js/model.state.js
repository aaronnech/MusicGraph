function State() {
	var self = this;

	self.isSaved = function() {
		return localStorage.getItem('playlist') != null;
	};

	self.restoreSongs = function(playList) {
		var protoSongs = JSON.parse(JSON.parse(localStorage.getItem('playlist')));

		var songs = protoSongs.map(function(protoSong) {
			return new Song(protoSong);
		});
		playList.songs(songs);
	};

	self.saveSongs = function(playList) {
		var protoSongs = JSON.stringify(playList.songs().map(function(song) {
			return song.track;
		}));
		localStorage.setItem('playlist', JSON.stringify(protoSongs));
	};

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