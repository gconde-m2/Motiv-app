const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const pictureSchema = new Schema(
  {
    kind: String,

    theme: [String], //NO SE QUÉ HACER CON ESTO!! many to many o no

    path: String,

    name: String,

    originalName: String,

    author: String,
  },
  {
    timestamps: true,
  }
);

const Picture = mongoose.model("Picture", pictureSchema);
module.exports = Picture;
