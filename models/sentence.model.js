const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sentenceSchema = new Schema(
  {
    sentence: Object
  }
);

const Sentence = mongoose.model("Sentence", sentenceSchema);
module.exports = Sentence;