const mongoose = require('mongoose');

const songSchema =  new mongoose.Schema({
  path:{
     type: String,
  },
  name:{
      type:String,
  },
});

module.exports = mongoose.model("Song", songSchema);