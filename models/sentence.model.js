const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sentenceSchema = new Schema(
  {
    kind: String,

    theme: [String], //NO SE QUÉ HACER CON ESTO!! many to many o no

    phrase: String,

    author: String,
  },
  {
    timestamps: true,
  }
);

const Sentence = mongoose.model("Sentence", sentenceSchema);
module.exports = Sentence;
