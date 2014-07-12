function AppViewModel() {
	var self = this;

	var drilledGenre = null;
	var drilledArtists = null;

	self.apiService = new MusicAPI();

	self.nodes = new ko.observableArray([]);
	self.edges = new ko.observableArray([]);
	self.state = new State();
	self.playList = new Playlist(self.state);
	self.playList.stopWaveform();
	self.level = new ko.observable('genre');


	var makeArtists = function(node, artists) {
		drilledGenre = node;
		drilledArtists = artists;
		self.edges.removeAll();
		self.nodes.removeAll();
		var nodes = artists.map(function(artist) {
			return new Node(self, artist, NODE_TYPES.ARTIST);
		});
		self.addNode(node);
		nodes.forEach(function(artistNode) {
			self.addEdge(new Edge(node, artistNode));
			self.addNode(artistNode);
		});
		self.level('artist');
	};

	var makeSongs = function(node, songs) {
		self.edges.removeAll();
		self.nodes.removeAll();
		var nodes = songs.map(function(song) {
			return new Node(self, song, NODE_TYPES.SONG);
		});
		self.addNode(node);
		nodes.forEach(function(songNode) {
			self.addEdge(new Edge(node, songNode));
			self.addNode(songNode);
		});
		self.level('song');
	};

	var makeGenre = function(genre) {
		self.edges.removeAll();
		self.nodes.removeAll();
		genre
		.map(function(name) {
			return new Node(self, new Genre(name, name.toLowerCase()), NODE_TYPES.GENRE);
		})
		.forEach(function(node) {
			self.addNode(node);
		});
		self.level('genre');
	};

	self.setAccessToken = function(token) {
		self.apiService.setToken(token);
	};

	self.initGenre = function() {
		makeGenre(['Electronic', 'Rock', 'Pop', 'Metallica', 'Trance', 'Dubstep', 'Classical', 'R&B', 'Rap', 'Jazz']);
	};

	self.addNode = function(node) {
		self.nodes.push(node);
	};

	self.addEdge = function(edge) {
		self.edges.push(edge);
	};

	self.removeNode = function(node) {
		var index = self.nodes().indexOf(node);
		if(index > -1) {
			self.nodes.splice(index, 1);
		}
	};

	self.clickNode = function(node) {
		node.onClick(self.explore);
	};

	self.nodeMouseOver = function(node) {

	};

	self.nodeMouseOut = function(node) {

	};

	self.deletePlaylistSong = function(song) {
		self.playList.removeSong(song);
	}

	self.playSong = function(song) {
		self.playList.playSong(song);
	};

	self.clickGenreBreadCrumb = function() {
		self.initGenre();
	};

	self.clickArtistBreadCrumb = function() {
		makeArtists(drilledGenre, drilledArtists);
	};

	self.makePlaylist = function() {
		self.apiService.makePlaylist(self.playList, 'MusicGraph Play List');
	};

	self.explore = function(node, result) {
        switch (node.nodeType) {
            case NODE_TYPES.GENRE:
                makeArtists(node, result);
                break;
            case NODE_TYPES.ARTIST:
                makeSongs(node, result);
                break;
            case NODE_TYPES.SONG:
            	self.playList.addSong(result);
                self.playSong(result);
                break;
        }
	};
	self.state.doLocalActions(self);
}