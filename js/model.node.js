function Node(viewModel, song, nodeType) {
    var self = this;

    self.position = {
        x : ko.observable(x),
        y : ko.observable(y)
    };

    self.viewModel = viewModel;
    self.nodeType = type;
    self.song = song;

    self.onClick = function() {
        switch (self.nodeType) {
            case NODE_TYPE.GENRE:
                // HANDLE GENRE CLICK
                break;
            case NODE_TYPE.ARTIST:
                // HANDLE ARTIST CLICK
                break;
            case NODE_TYPE.SONG:
                // HANDLE SONG CLICK
                break;
            default:
                // NEEDED?
        }
    };
}

var NODE_TYPE = {
    GENRE : 0,
    ARTIST : 1,
    SONG : 2
};
