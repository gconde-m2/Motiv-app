const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const auxSchema = new Schema(
  {
    backString:String
  }
);
const Aux = mongoose.model("AuxTab", auxSchema);
module.exports = Aux;