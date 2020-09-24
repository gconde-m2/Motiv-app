const mongoose = require("mongoose");
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  goal:[
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Goal"
    },
  ],

}, 
{
  timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;