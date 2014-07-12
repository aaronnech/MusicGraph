function Playlist() {
    var self = this;

    self.songs = new ko.observableArray([]);
    self.currentSong = new ko.observable(-1);
    self.playing = false;


    var setSongsNotPlaying = function() {
        for(var i = 0; i < self.songs().length; i++) {
            self.songs()[i].isPlaying(false);
        }
    };

    // ADD A SONG TO THE END OF THE PLAYLIST
    self.addSong = function(song) {
        if(self.songs.indexOf(song) === -1)
            self.songs.push(song);
    };

    // REMOVE A SONG FROM THE PLAYLIST
    self.removeSong = function(song) {
        var index = self.songs.indexOf(song);
        if (index > -1) {
            self.songs.splice(index, 1);
        }
    };

    self.songEnded = function() {
        if(self.playing) {
            self.currentSong(self.currentSong + 1);
            if(self.currentSong() < self.songs().length) {
                self.songs()[self.currentSong()].play(self.songEnded);
            } else {
                self.playing = false;
                self.stopWaveform();
            }
        }
    };

    self.play = function() {
        if(self.songs().length > 0) {
            self.playSong(self.songs()[0]);
        }
    };

    self.playSong = function(song) {
        if(self.songs().length > 0) {
            setSongsNotPlaying();
            self.currentSong(self.songs.indexOf(song));
            self.playing = true;
            self.startWaveform();
            self.songs()[self.currentSong()].play(self.songEnded);

            $("audio").animate({volume: 0}, 0);
            $("audio").animate({volume: 1.0}, 500);
            setTimeout(function() {
                $("audio").animate({volume: 0}, 1000);
            }, 29500);
        }
    };

    self.stopWaveform = function() {
        $("#waveOne").attr("dur", "20s");
        $("#waveTwo").attr("dur", "25s");
    }

    self.startWaveform = function() {
        $("#waveOne").attr("dur", "3s");
        $("#waveTwo").attr("dur", "5s");
    }

    // RETURNS THE LENGTH OF THE PLAYLIST
    self.length = function() {
        return self.songs.length;
    };
};
