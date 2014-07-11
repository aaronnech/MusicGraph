function AppViewModel() {
	var self = this;

	self.apiService = new MusicAPI();

	self.nodes = new ko.observableArray([]);
	self.edges = new ko.observableArray([]);

	self.addNode = function(node) {
		self.nodes.push(node);
	};

	self.removeNode = function(node) {
		var index = self.nodes().indexOf(node);
		if(index > -1) {
			self.nodes.splice(index, 1);
		}
	};

	self.clickNode = function(node) {
		node.onClick(self.expandPlayer);
	};

	self.nodeMouseOver = function(node) {

	};

	self.nodeMouseOut = function(node) {

	};

	self.expandPlayer = function(node, result) {
		
	};
}