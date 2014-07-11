var nodeCounter = 0;

function Node(vm, song, nodeType, x, y) {
    var self = this;

    self.x = x;
    self.y = y;

    self.vm = vm;
    self.weight = 1;
    self.nodeType = nodeType;
    self.song = song;
    self.id = new ko.observable('node-' + nodeCounter++);

    // HANDLES CLICK EVENTS ON THIS NODE
    self.onClick = function(callback) {
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
        // callback(self, {RESULT});
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
