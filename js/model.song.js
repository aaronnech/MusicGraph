function Song(track) {
	var self = this;

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

	self.fetchSoundFile = function(id, loop) {
		soundHandle = document.getElementById(id);
		soundHandle.setAttribute('src', '');
		var newSoundHandle = soundHandle.cloneNode(true);
		soundHandle.parentNode.replaceChild(newSoundHandle, soundHandle);
		soundHandle = newSoundHandle;
		soundHandle.setAttribute('src', self.url);
		if(loop)
			soundHandle.setAttribute('loop', loop);
	}

	var self = this;

	self.name = track.name;
	self.fullName = track.name + ' - ' + track.artists[0].name;
	self.url = track.preview_url;
	self.isPlaying = new ko.observable(false);

	self.play = function(playerId, ended) {
		self.isPlaying(true);
		startSound(playerId, ended);
        // setTimeout(function() {
        //     $("audio").animate({volume: 0}, 1000);
        // }, 29500);
	}
}
