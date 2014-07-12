function Playlist(vm) {
    var self = this;

    self.vm = vm;
    self.songs = new ko.observableArray([]);

    // ADD A SONG TO THE END OF THE PLAYLIST
    self.addSong = function(song) {
        self.songs.push(song);
    };

    // REMOVE A SONG FROM THE PLAYLIST
    self.removeSong = function(song) {
        var index = self.songs.indexOf(song);
        if (index > -1) {
            self.songs.splice(index, 1);
        }
    };

    // RETURNS THE LENGTH OF THE PLAYLIST
    self.length = function() {
        return self.songs.length;
    };

    // HANDLES CLICK EVENTS ON SONGS IN THE PLAYLIST
    self.onClick = function(song) {
        // Handle
    };
};
