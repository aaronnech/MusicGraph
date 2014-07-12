/**
 * @fileOverview A Playlist is a stateful object that controls and manages
 * playing songs through song objects.
 *
 * When the page loads, it attempts to ask the passed state manager for any
 * playlist state that may have been stored.
 * 
 */

function Playlist(state) {
    var self = this;
    var PLAYER_ID = 'audio-player';
    var PLAYER_ID_2 = 'audio-player-2';

    self.state = state;
    self.songs = new ko.observableArray([]);
    if(self.state.isSaved()) {
        self.state.restoreSongs(self);
    }
    self.currentSong = new ko.observable(-1);
    self.playing = false;


    /**
     * Helper that sets all the song states to not playing.
     */
    var setSongsNotPlaying = function() {
        for(var i = 0; i < self.songs().length; i++) {
            self.songs()[i].isPlaying(false);
        }
    };


    /**
     * Get the playlist in Spotify API track form.
     */
    self.getTracks = function() {
        var results = [];
        for (var i = 0; i < self.songs().length; i++) {
            results.push(self.songs()[i].track.uri);
        }
        return results;
    };


    /**
     * Find (using a linear search) a passed song
     * Comparison is defined as equal reference or equal full song name.
     */
    self.findSong = function(song) {
        for(var i = 0; i < self.songs().length; i++) {
            if(self.songs()[i] === song ||
                self.songs()[i].fullName === song.fullName)
                return i;
        }
        return -1;
    };


    /**
     * Adds a song (if not present in the list) to the playlist.
     */
    self.addSong = function(song) {
        if(self.findSong(song) === -1) {
            self.songs.push(song);
            self.state.saveSongs(self);
        }
    };


    /**
     * Removes a song (if present) from the list
     */
    self.removeSong = function(song) {
        var index = self.findSong(song);
        if (index > -1) {
            self.songs.splice(index, 1);
            self.state.saveSongs(self);
        }
    };


    /**
     * Helper that sets all the song states to not playing.
     */
    self.songEnded = function() {
        if(self.playing) {
            self.currentSong(self.currentSong() + 1);
            if(self.currentSong() < self.songs().length) {
                self.playSong(self.songs()[self.currentSong()]);
            } else {
                self.playing = false;
                self.stopWaveform();
            }
        }
    };


    /**
     * Plays a playlist from the beginning.
     */
    self.play = function() {
        if(self.songs().length > 0) {
            self.playSong(self.songs()[0]);
        }
    };


    /**
     * Plays a playlist from a given song.
     */
    self.playSong = function(song) {
        if(self.songs().length > 0) {
            setSongsNotPlaying();
            self.playing = true;
            self.currentSong(self.findSong(song));
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


    /**
     * Prefetches a song for a given playerId
     */
    self.prefetchSong = function(playerId) {
        var length = self.songs().length;
        if (length > 0 && self.currentSong() + 1 < length) {
            var currentSongObject = self.songs()[self.currentSong() + 1];
            currentSongObject.fetchSoundFile(playerId, false);
        }
    };


    /**
     * Stops the plangular wave effect
     */
    self.stopWaveform = function() {
        $("#waveOne").attr("dur", "20s");
        $("#waveTwo").attr("dur", "25s");
    };


    /**
     * Starts the plangular wave effect
     */
    self.startWaveform = function() {
        $("#waveOne").attr("dur", "3s");
        $("#waveTwo").attr("dur", "5s");
    };
};
