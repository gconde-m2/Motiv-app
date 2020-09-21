const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contentSchema = new Schema(
  {
    name: {
      type: String,
    },

    theme: {
      type: [String],
      enum: [
        "social",
        "work",
        "health",
        "beauty",
        "home",
        "friends",
        "sports",
        "food",
        "music",
        "travel",
      ],
    },

    image: String,
    song: String,
    sentence: String,
  },
  {
    timestamps: true,
  }
);

const Content = mongoose.model("Content", contentSchema);
module.exports = Content;
