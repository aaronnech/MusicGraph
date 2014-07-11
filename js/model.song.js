function Song(track) {
	var self = this;

	var startSound = function(id, url, ended, loop) {
		soundHandle = document.getElementById(id);
		var newSoundHandle = soundHandle.cloneNode(true);
		soundHandle.parentNode.replaceChild(newSoundHandle, soundHandle);
		soundHandle = newSoundHandle;
		soundHandle.setAttribute('src', url);
		if(loop)
			soundHandle.setAttribute('loop', loop);
		soundHandle.play();
		soundHandle.addEventListener('ended', ended, false);
	}

	var self = this;
	

	var PLAYER_ID = 'audio-player';

	self.name = track.name;
	self.url = track.preview_url;

	self.play = function(ended) {
		startSound(PLAYER_ID, self.url, ended, false);
	}
}
