function AppViewModel() {
	var self = this;

	self.apiService = new MusicAPI();

	self.nodes = new ko.observableArray([]);
	self.edges = new ko.observableArray([]);

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

	var makeSongs = function(songs) {

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

	self.playSong = function(song) {
		song.play();
	};

	self.explore = function(node, result) {
        switch (self.nodeType) {
            case NODE_TYPES.GENRE:
                makeArtists(node, result);
                break;
            case NODE_TYPES.ARTIST:
                makeSongs(node, result);
                break;
            case NODE_TYPES.SONG:
                self.playSong(result);
                break;
        }
	};
}