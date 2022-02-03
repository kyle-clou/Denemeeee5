const client = process.client;
const cfg = require("../index.json");
const Database = require("../models/stat.js");
const config = require('../../Moderation/Configs/guildSystem')
class Ready {
  constructor(guild) {
    this.guild = guild;
  }
  
  kur() {
    client.user.setPresence({ activity: { name: config.botPresence }, status: "idle" });
    client.guilds.cache.get(config.guildID).channels.cache.filter(c => (c.type === 'voice') && (c.members.size > 0)).forEach(channel => {
      channel.members.filter(user => (!user.user.bot) || (!user.selfDeaf)).forEach(user => {
        client.VoiceMap.set(user.id, {
          channel: channel.id,
          time: Date.now()
        });
      });
    });
    console.log("("+client.user.username +") adlı hesapta ["+this.guild.name+"] adlı sunucuda giriş yapıldı.");
  }
  
  VoiceSave() {
    client.VoiceMap.forEach((val, key) => {
      let user = client.guilds.cache.get(config.guildID).members.cache.get(key);
      if ((!user) || (user.voice.selfDeaf) || (user.user.bot)) return;
      client.voiceCount({Database: Database, userID: key, channelID: val.channel, time: (Date.now() - val.time)});
      client.VoiceMap.set(key, {
        channel: val.channel,
        time: Date.now()
      });
    });
  }
}

async function Readyy() {
  const XD = new Ready(client.guilds.cache.get(config.guildID));
  await XD.kur();
  client.guilds.cache.get(config.guildID).channels.cache.get(config.voiceChannel).join().catch()
  setInterval(() => XD.VoiceSave(), client.getDate(60, "saniye"));
};

module.exports.event = {
  name: "ready",
  eventOn: () => Readyy()
};
