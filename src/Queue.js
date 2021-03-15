const Song=require('../models/songs')


class Queue{
    constructor(){
        this.songs=[];
        this.currentSong=null;
        this.currIndex=-1;
    }

    async loadSongs(){
        let allSongs= await Song.find().sort({ _id: -1 });
        
        if (this.songs.length != allSongs.length){
            this.songs=allSongs;
            this.currIndex=-1;
            this.currentSong=null;
        }
        this.songs=allSongs;
        console.log("Total Songs:"+this.songs.length);
    }

    async nextSong(){
        // await this.loadSongs();
        this.currIndex=(this.currIndex+1)%this.songs.length;
        this.currentSong=this.songs[this.currIndex];
    }
}

module.exports= Queue;