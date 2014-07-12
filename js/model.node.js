var nodeCounter = 0;

function Node(vm, dataString, nodeType) {
    var self = this;

    self.x = 0;
    self.y = 0;

    self.vm = vm;
    self.weight = 1;
    self.nodeType = nodeType;
    self.dataString = dataString;
    self.id = new ko.observable('node-' + nodeCounter++);

    // HANDLES CLICK EVENTS ON THIS NODE
    self.onClick = function(callback) {
        switch (self.nodeType) {
            case NODE_TYPES.GENRE:
                vm.apiService.getArtists(self.dataString.apiName, function(results) {
                    callback(self, results);
                });
                break;
            case NODE_TYPES.ARTIST:
                vm.apiService.getArtistTopTracks(self.dataString.id, function(results) {
                    callback(self, results);
                });
                break;
            case NODE_TYPES.SONG:
                callback(self, self.dataString);
                break;
        }
    };

    self.toD3 = ko.computed(function() {
        return {
            x : self.x,
            y : self.y
        };
    });
};

var NODE_TYPES = {
    GENRE : 0,
    ARTIST : 1,
    SONG : 2
};
