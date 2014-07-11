function AppViewModel() {
	var self = this;

	self.apiService = new MusicAPI();

	self.nodes = new ko.observableArray([]);
	self.edges = new ko.observableArray([]);
	self.playList = new Playlist();

	var makeArtists = function(node, artists) {
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
}