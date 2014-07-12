function Playlist() {
    var self = this;

    self.songs = new ko.observableArray([]);
    // if(localStorage.getItem("playlist")) {
    //     console.log(JSON.parse(localStorage.getItem("playlist")));
    //     self.songs(JSON.parse(localStorage.getItem("playlist")));
    // }
    self.currentSong = new ko.observable(-1);
    self.playing = false;


    var setSongsNotPlaying = function() {
        for(var i = 0; i < self.songs().length; i++) {
            self.songs()[i].isPlaying(false);
        }
    };

    // ADD A SONG TO THE END OF THE PLAYLIST
    self.addSong = function(song) {
        if(self.songs.indexOf(song) === -1) {
            self.songs.push(song);
            //localStorage.setItem("playlist", JSON.stringify(self.songs()));
        }
    };

    // REMOVE A SONG FROM THE PLAYLIST
    self.removeSong = function(song) {
        var index = self.songs.indexOf(song);
        if (index > -1) {
            self.songs.splice(index, 1);
            //localStorage.setItem("playlist", JSON.stringify(self.songs()));
        }
    };

    self.songEnded = function() {
        if(self.playing) {
            self.currentSong(self.currentSong() + 1);
            if(self.currentSong() < self.songs().length) {
                self.playSong(self.songs()[self.currentSong()]);x
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

    var PLAYER_ID = 'audio-player';
    var PLAYER_ID_2 = 'audio-player-2';

    self.playSong = function(song) {
        if(self.songs().length > 0) {
            setSongsNotPlaying();
            self.playing = true;
            self.currentSong(self.songs.indexOf(song));
            self.startWaveform();

            var soundHandle = document.getElementById(PLAYER_ID);
            var src = soundHandle.getAttribute("src");

            var soundHandle2 = document.getElementById(PLAYER_ID_2);
            var src2 = soundHandle2.getAttribute("src");

            soundHandle.pause();
            soundHandle2.pause();
            if (src == song.url) {
                song.play(PLAYER_ID, self.songEnded);
                self.prefetchSong(PLAYER_ID_2);
            } else if (src2 == song.url) {
                song.play(PLAYER_ID_2, self.songEnded);
                self.prefetchSong(PLAYER_ID);
            } else { // Not Loaded, use the first one
                song.fetchSoundFile(PLAYER_ID, false);
                song.play(PLAYER_ID, self.songEnded);
                self.prefetchSong(PLAYER_ID_2);
            }
        }
    };

    self.prefetchSong = function(playerId) {
        var length = self.songs().length;
        if (length > 0 && self.currentSong() + 1 < length) {
            var currentSongObject = self.songs()[self.currentSong() + 1];
            currentSongObject.fetchSoundFile(playerId, false);
        }
    };

    self.stopWaveform = function() {
        $("#waveOne").attr("dur", "20s");
        $("#waveTwo").attr("dur", "25s");
    };

    self.startWaveform = function() {
        $("#waveOne").attr("dur", "3s");
        $("#waveTwo").attr("dur", "5s");
    };

    // RETURNS THE LENGTH OF THE PLAYLIST
    self.length = function() {
        return self.songs.length;
    };
};
