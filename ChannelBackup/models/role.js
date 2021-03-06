const mongoose = require('mongoose');

const role = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildID: String,
  roleID: String,
  name: String,
  color: String,
  hoist: Boolean,
  position: Number,
  permissions: Number,
  mentionable: Boolean,
  time: Number,
  members: {type: Array, default: []},
  channelOverwrites: Array
});

module.exports = mongoose.model("2_backupm1", role);