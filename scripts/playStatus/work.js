(() => {
	const self = this;
	
	self.addEventListener('message', function(e) {
		let data = e.data;
		this.audioContext.seek(data);
		this.$store.commit('currentTime', {currentTime: data});
		self.postMessage('ok');
	}, false)
})()