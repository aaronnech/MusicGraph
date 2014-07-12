var nodeCounter = 0;

function Node(vm, song, nodeType, x, y) {
    var self = this;

    self.position = {
        x : new ko.observable(x),
        y : new ko.observable(y)
    };

    self.vm = vm;
    self.nodeType = nodeType;
    self.song = song;
    self.id = new ko.observable('node-' + nodeCounter++);

    // HANDLES CLICK EVENTS ON THIS NODE
    self.onClick = function() {
        switch (self.nodeType) {
            case NODE_TYPES.GENRE:
                // HANDLE GENRE
                console.log("You clicked GENRE bitch.");
                break;
            case NODE_TYPES.ARTIST:
                // HANDLE ARTIST
                console.log("You clicked ARTIST bitch.");
                break;
            case NODE_TYPES.SONG:
                // HANDLE SONG
                console.log("You clicked SONG bitch.");
                break;
            default:
                // NEEDED?
                console.log("Give me a Type!");
        }
    };

    self.toD3 = ko.computed(function() {
        return {
            x : self.position.x(),
            y : self.position.y()
        };
    });
};

var NODE_TYPES = {
    GENRE : 0,
    ARTIST : 1,
    SONG : 2
};
