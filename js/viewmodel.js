/**
 * @fileOverview A Knockout ViewModel which by definition in the MVVM pattern
 * communicates between models and views, and recieve / acts on actions to the view.
 */
function AppViewModel() {
	var self = this;
	// Keep state of which genre / artist we are in
	// for breadcrumbs
	var drilledGenre = null;
	var drilledArtists = null;

	self.apiService = new MusicAPI();
	self.nodes = new ko.observableArray([]);
	self.edges = new ko.observableArray([]);
	self.state = new State();
	self.playList = new Playlist(self.state);
	self.playList.stopWaveform();
	self.level = new ko.observable('genre');


	/**
	 * Helper function to make artist nodes show up from a genre
	 */
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


	/**
	 * Helper function to make song nodes show up from a artist node
	 */
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


	/**
	 * Helper function to make genre nodes show up given genres
	 */
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


	/**
	 * Sets the access token to the Spotify API
	 */
	self.setAccessToken = function(token) {
		self.apiService.setToken(token);
	};


	/**
	 * Initializes genres to a preset selection
	 */
	self.initGenre = function() {
		makeGenre(['Electronic', 'Rock', 'Pop', 'Metal', 'Trance', 'Dubstep', 'Classical', 'R&B', 'Rap', 'Jazz', 'Christmas']);
	};


	/**
	 * Adds a node to the graph
	 */
	self.addNode = function(node) {
		self.nodes.push(node);
	};


	/**
	 * Adds an edge to the graph
	 */
	self.addEdge = function(edge) {
		self.edges.push(edge);
	};


	/**
	 * Executed when a Node is clicked.
	 */
	self.clickNode = function(node) {
		node.onClick(self.explore);
	};


	/**
	 * Executed when a Node is moused over.
	 */
	self.nodeMouseOver = function(node) {
		// nothing to be done yet
	};


	/**
	 * Executed when a Node is moused out of.
	 */
	self.nodeMouseOut = function(node) {
		// nothing to be done yet
	};


	/**
	 * Slide hides a given element
	 */
	self.slideHideElement = function(elt) {
		var jq = $(elt);
		if(jq.is("li")) {
			jq.slideUp('fast');
		}
	};


	/**
	 * Deletes a playlist song given
	 */
	self.deletePlaylistSong = function(song) {
		self.playList.removeSong(song);
	}


	/**
	 * Plays a given song
	 */
	self.playSong = function(song) {
		self.playList.playSong(song);
	};


	/**
	 * Executes when the genre breadcrumb is clicked
	 */
	self.clickGenreBreadCrumb = function() {
		self.initGenre();
	};


	/**
	 * Executes when the artist breadcrumb is clicked
	 */
	self.clickArtistBreadCrumb = function() {
		makeArtists(drilledGenre, drilledArtists);
	};


	/**
	 * Makes a playlist
	 */
	self.makePlaylist = function() {
		self.apiService.makePlaylist(self.playList, 'MusicGraph Play List');
	};


	/**
	 * Explores a given node (drilled into it). Generally executed in callback
	 * to a node click.
	 */
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


	// On construction if this is a page load due to
	// the spotify callback, we need to act on it with the new
	// authentication.
	self.state.doLocalActions(self);
}