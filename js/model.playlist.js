function Playlist() {
    var self = this;

    self.songs = [];

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
        return songs.length;
    };
};
