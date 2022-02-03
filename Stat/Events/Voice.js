const cfg = require("../index.json");
const Database = require("../models/stat.js");
const client = process.client;
const config = require('../../Moderation/Configs/guildSystem')

class Voice {
  constructor(oldState, newState) {
    this.oldState = oldState;
    this.newState = newState;
  }

  async VoiceCounter() {
    if ((this.oldState.member) && ((this.oldState.member.user.bot) || (this.newState.selfDeaf)) || [].some(x => this.oldState.member.roles.cache.get(x))) return;
    if ((!this.oldState.channel) && (this.newState.channel)) {
     client.VoiceMap.set(this.oldState.id, {
       channel: this.newState.channelID,
       time: Date.now()
     });
    };
    
    if (!client.VoiceMap.has(this.oldState.id)) client.VoiceMap.set(this.oldState.id, {
      channel: this.newState.channelID,
      time: Date.now()
    });
    
    let Veri = client.VoiceMap.get(this.oldState.id);
    if (!Veri) return;
    
    if ((this.oldState.channel) && (!this.newState.channel) && (Veri.channel !== null)) {
       client.voiceCount({Database: Database, userID: this.oldState.id, channelID: Veri.channel, time: Date.now() - Veri.time});
       client.VoiceMap.delete(this.oldState.id);
    } else if ((this.oldState.channel) && (this.newState.channel) && (Veri.channel !== null)) {
       client.voiceCount({Database: Database, userID: this.oldState.id, channelID: Veri.channel, time: Date.now() - Veri.time});
       client.VoiceMap.set(this.oldState.id, {
        channel: this.newState.channelID,
        time: Date.now()
      });
    };
  }
}

module.exports.event = {
  name: "voiceStateUpdate",
  eventOn: (oldState, newState) => new Voice(oldState, newState).VoiceCounter()
};