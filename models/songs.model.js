const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const songSchema = new Schema(
  {
    songId: String,
    name: String
  }
);

const Song = mongoose.model("Song", songSchema);
module.exports = Song;