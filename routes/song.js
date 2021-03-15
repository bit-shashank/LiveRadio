const express = require("express");
const router = express.Router();
const multer=require('multer');
const Song=require('../models/songs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname );
    }
})
const upload=multer({storage:storage});

router.get("/upload",(req,res)=>{
    res.render("upload");
});

router.post("/upload",upload.single('song'),async (req,res)=>{
    const file=req.file;

    const song=new Song({
        path:file.path,
        name:req.body.name,
    });

    try{
        await song.save();
        console.log("New Song Uploaded");
        res.send("Song Uploaded Succesfully");

        let songs=await Song.find({});
        console.log("Total Songs:"+songs.length);
    }
    catch(e){
        console.log(e);
        res.send("Error Occured");
    }
});


router.get('/all',async (req,res)=>{
    let songs= await Song.find().sort({ _id: -1 });
    res.render("allSongs",{songs:songs});
})



module.exports = router;
