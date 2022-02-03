const mongoose = require("mongoose");

const Veri = mongoose.Schema({
  guildID: {type: String},
  userID: {type: String},
  tagges: {type: Array,default: []},
  sayi: {type: Number,default: 0},
  kayitSayi: {type: Number,default: 0},
  inviteSayi: {type: Number,default: 0}
});

module.exports = mongoose.model("other", Veri);