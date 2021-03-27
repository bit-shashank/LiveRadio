const express= require('express');
const app=express()
const fs=require('fs');
const path=require('path');
const Throttle = require('throttle');  
let mongoose = require('mongoose');
let Songs=require('./models/songs');
const  {File} = require("node-taglib-sharp");
const Queue=require("./src/Queue");
require('dotenv').config();


//Conneting to database

let connURL="mongodb+srv://loneCoder:QWERTY1234@cluster0-avdpm.mongodb.net/songDB?retryWrites=true&w=majority";
mongoose.connect(connURL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
});

const con = mongoose.connection;
con.on("open", () => {
	console.log("Connected To Database");
});



//Views 
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))
app.use(express.json());


const songsRouter = require("./routes/song");
const songs = require('./models/songs');
app.use('/song',songsRouter);

app.get('/',(req,res)=>{
    res.render('index.ejs');
})

app.get('/stream', function(req,res){
    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
    });
    writables.push(res);
});

const server=app.listen(process.env.PORT || 9000, ()=>{
    console.log("Server Started");
});// starting a server at port 9000 



app.get('/next',(req,res)=>{
    songQueue.nextSong();
    playSong();
});






writables=[]
let songQueue;
startStreaming();

async function startStreaming(){
    songQueue=new Queue();
    await songQueue.loadSongs();
    songQueue.nextSong();
    // console.log(songQueue.songs);
    playSong();
}

function playSong(){
    let songPath=songQueue.currentSong.path;
    let songLocation=path.dirname(__filename)+ "\\" + songPath;

    try{
        // console.log(songQueue.songs);
        let songFile=File.createFromPath(songLocation);
        const bitRate=songFile.properties.audioBitrate;
        let musicStream=fs.createReadStream(songLocation);
        const throttle = new Throttle(bitRate*1000 / 8);

        console.log("Now Playing "+ songPath);
        musicStream.pipe(throttle).on('data', (chunk) => {
            for (const writable of writables) {
              writable.write(chunk);
        }});
        
        musicStream.on('end',()=>{
            songQueue.nextSong();
            playSong();
        });
    }
    catch(e){
        console.log("Unable to play "+songPath);
        songQueue.nextSong();
        playSong();
    }

}
