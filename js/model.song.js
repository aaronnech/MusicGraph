/**
 * @fileOverview A Song is playable spotify track that has a reference
 * 	to a Spotify sample stream.
 */

function Song(track) {
	var self = this;

	self.track = track;
	self.name = track.name;
	self.fullName = track.name + ' - ' + track.artists[0].name;
	self.url = track.preview_url;
	self.isPlaying = new ko.observable(false);

	/**
	 * Helper method that starts a song sample for a given playerId
	 * and a callback to call when it ends.
	 * @param  {string} id    ID to target the dom to play
	 * @param  {function} ended  Callback to trigger when the song sample ends
	 */
	var startSound = function(id, ended) {
		var soundHandle = document.getElementById(id);
		soundHandle.play();
		$("audio").animate({volume: 0}, 0);
		if(typeof ended !== 'undefined')
			soundHandle.addEventListener('ended', function() {
				self.isPlaying(false);
				ended();
			}, false);
		$("audio").animate({volume: 1.0}, 1);
	}


	/**
	 * Fetches a sound file for a player
	 * @param  {string} id    ID to target the dom to play
	 * @param  {boolean} loop  whether to loop the song or not.
	 */
	self.fetchSoundFile = function(id, loop) {
		soundHandle = document.getElementById(id);
		soundHandle.setAttribute('src', '');
		var newSoundHandle = soundHandle.cloneNode(true);
		soundHandle.parentNode.replaceChild(newSoundHandle, soundHandle);
		soundHandle = newSoundHandle;
		soundHandle.setAttribute('src', self.url);
		if(loop)
			soundHandle.setAttribute('loop', loop);
	};


	/**
	 * Plays a song sample for a given playerID
	 * @param  {string} playerId    ID to target the dom to play
	 * @param  {function} ended  Callback to trigger when the song sample ends
	 */
	self.play = function(playerId, ended) {
		self.isPlaying(true);
		startSound(playerId, ended);
	}
}
