const mongoose = require("mongoose");

const Veri = mongoose.Schema({
  guildID: {type: String},
  userID: {type: String},
  staffPoint: {type: Number,default: 0}
});

module.exports = mongoose.model("system", Veri);