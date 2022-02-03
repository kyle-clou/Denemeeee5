const mongoose = require("mongoose");

const Veri = mongoose.Schema({
  guildID: {type: String},
  userID: {type: String},
  register: {type: Number,default: 0},
  public: {type: Number,default: 0},
  yonetim: {type: Number,default: 0},
  alone: {type: Number,default: 0},
  private: {type: Number,default: 0},
music: {type: Number,default: 0},
  terapi: {type: Number,default: 0},
  soruncozme: {type: Number,default: 0},
});

module.exports = mongoose.model("channelpoints", Veri);