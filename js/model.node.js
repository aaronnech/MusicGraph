/**
 * @fileOverview A Node is a stateful object that helps bridge the gap
 * between D3.js and Knockout.js
 *
 * It represents a graph node that is clickable
 */

// Global node counter to keep Ids unique
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

    /**
     * Called when a node is clicked (triggered by the ViewModel)
     * @param  {function} callback  Callback to trigger when execution completes
     */
    self.onClick = function(callback) {
        switch (self.nodeType) {
            case NODE_TYPES.GENRE:
                self.vm.apiService.getArtists(self.dataString.apiName, function(results) {
                    callback(self, results);
                });
                break;
            case NODE_TYPES.ARTIST:
                self.vm.apiService.getArtistTopTracks(self.dataString.id, function(results) {
                    callback(self, results);
                });
                break;
            case NODE_TYPES.SONG:
                callback(self, self.dataString);
                break;
        }
    };


    /**
     * Converts this node to a KO computed D3 record that can be observed (subscribed to)
     * by D3
     */
    self.toD3 = ko.computed(function() {
        return {
            x : self.x,
            y : self.y
        };
    });
};

/**
 * Enumeration of possible node types.
 * @type {Enum.<int>}
 */
var NODE_TYPES = {
    GENRE : 0,
    ARTIST : 1,
    SONG : 2
};
