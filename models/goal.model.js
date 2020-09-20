const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const goalSchema = new Schema(
  {
    name: {
      type: String, 
      
    },

    theme: [String], 

    sentence: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Sentence",
        },
    ],

    picture: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Picture",
        },
    ],

    song: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Song",
        },
    ],
    
  },
  {
    timestamps: true,
  }
);

const Goal = mongoose.model("Goal", goalSchema);
module.exports = Goal;
