function Node(viewModel, song, nodeType, x, y) {
    var self = this;

    self.position = {
        x : ko.observable(x),
        y : ko.observable(y)
    };

    self.viewModel = viewModel;
    self.nodeType = nodeType;
    self.song = song;

    self.onClick = function() {
        switch (self.nodeType) {
            case NODE_TYPES.GENRE:
                // HANDLE GENRE CLICK
                break;
            case NODE_TYPES.ARTIST:
                // HANDLE ARTIST CLICK
                break;
            case NODE_TYPES.SONG:
                // HANDLE SONG CLICK
                break;
            default:
                // NEEDED?
        }
    };
}

var NODE_TYPES = {
    GENRE : 0,
    ARTIST : 1,
    SONG : 2
};
