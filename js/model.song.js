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
		$("audio").animate({volume: 0}, 0);
		if(typeof ended !== 'undefined')
			soundHandle.addEventListener('ended', function() {
				self.isPlaying(false);
				ended();
			}, false);
		$("audio").animate({volume: 1.0}, 1000);
	};

	var PLAYER_ID = 'audio-player';

	self.name = track.name;
	self.fullName = track.name + ' - ' + track.artists[0].name;
	self.url = track.preview_url;
	self.isPlaying = new ko.observable(false);

	self.play = function(ended) {
		self.isPlaying(true);
		startSound(PLAYER_ID, self.url, ended, false);
        setTimeout(function() {
            $("audio").animate({volume: 0}, 1000);
        }, 29500);
	}
}
