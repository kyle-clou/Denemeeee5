const mongoose = require("mongoose");

const Veri = mongoose.Schema({
guildID: {type: String},
userID: {type: String},
type: {type: String},
count: {type: Number,default: 5},
compCount: {type: Number,default: 0},
prize: {type: Number},
active: {type: Boolean,default: false},
comp: {type: Boolean,default: false},
channel: {type: String},

});

module.exports = mongoose.model("task", Veri);