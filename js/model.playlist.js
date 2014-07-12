function Playlist() {
    var self = this;

    self.songs = new ko.observableArray([]);
    self.currentSong = -1;
    self.playing = false;

    // ADD A SONG TO THE END OF THE PLAYLIST
    self.addSong = function(song) {
        if(!self.playing)
            self.songs.push(song);
    };

    // REMOVE A SONG FROM THE PLAYLIST
    self.removeSong = function(song) {
        if(!self.playing) {
            var index = self.songs.indexOf(song);
            if (index > -1) {
                self.songs.splice(index, 1);
            }
        }
    };

    self.songEnded = function() {
        if(self.playing) {
            self.currentSong++;
            if(self.currentSong < self.songs().length) {
                self.songs()[self.currentSong].play(self.songEnded);
            } else {
                self.playing = false;
                self.stopWaveform();
            }
        }
    };

    self.play = function() {
        if(self.songs().length > 0) {
            self.playing = true;
            self.startWaveform();
            self.currentSong = 0;
            self.songs()[self.currentSong].play(self.songEnded);
        }
    };

    self.stopWaveform = function() {
        $("#waveOne").attr("dur", "0s");
        $("#waveTwo").attr("dur", "0s");
    }

    self.startWaveform = function() {
        $("#waveOne").attr("dur", "0s");
        $("#waveTwo").attr("dur", "0s");
    }

    // RETURNS THE LENGTH OF THE PLAYLIST
    self.length = function() {
        return self.songs.length;
    };
};
