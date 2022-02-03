const mongoose = require("mongoose");

const Veri = mongoose.Schema({
  SunucuID: String,
  userID: String,
  ToplamSes: Map,
  ToplamMesaj: Map,
  VoiceNumber: Number,
  MessageNumber: Number
});

module.exports = mongoose.model("Stats", Veri);