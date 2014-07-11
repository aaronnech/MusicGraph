function AppViewModel() {
	var self = this;

	self.apiService = null;

	self.nodes = new ko.observableArray([]);

	self.addNode = function(node) {
		self.nodes.push(node);
	};

	self.clickNode = function(event) {

	};
}