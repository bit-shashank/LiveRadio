const Song = require("../models/songs");

class Queue {
	constructor() {
		this.songs = [];
		this.currentSong = null;
		this.currIndex = -1;
	}

	async loadSongs() {
		this.songs = await Song.aggregate(
            [ { $sample: { size: 5 } } ]
         );
         console.log("New Playlist");
         console.log(this.songs);
	}

	async nextSong() {
		// await this.loadSongs();
		this.currIndex = (this.currIndex + 1);
        if (this.currIndex== this.songs.length){
            await this.loadSongs();
            this.currIndex=0;
        }
		this.currentSong = this.songs[this.currIndex];
	}
}

module.exports = Queue;
