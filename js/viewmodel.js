function AppViewModel() {
	var self = this;

	self.apiService = null;

	self.nodes = new ko.observableArray([]);
	self.edges = new ko.observableArray([]);

	self.addNode = function(node) {
		for (var i = 0; i < self.nodes().length; i++) {
			self.edges.push(new Edge(node, self.nodes()[i]));
		}
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