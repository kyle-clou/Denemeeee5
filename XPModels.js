const mongoose = require('mongoose')

const xpModel = new mongoose.Schema({
guildID: {type: String},
userID: {type: String},
xp: {type: Number,default: 0},
level: {type: Number,default: 0}
})

const guildModel = new mongoose.Schema({
    guildID: {type: String},
    ranks: {type: Array}
})

