const cfg = require("../index.json");
const Database = require("../models/stat.js");
const client = process.client;
const config = require('../../Moderation/Configs/guildSystem')
const Point = require('../models/staffSystem')
const settings = require('../../staff')
const {GuildMember,MessageEmbed} = require('discord.js')

class Message {
  constructor(msg) {
    this.msg = msg
  }
  
  async MessageStats() {
    let MessageMap2 = new Map()
    if (this.msg.author.bot || [].some(x => this.msg.member.roles.cache.get(x)) || this.msg.guild.id !== config.guildID || this.msg.channel.type === "dm" || cfg.prefixes.some(x => this.msg.content.toLowerCase().startsWith(x))) return;
    Database.findOne({SunucuID: this.msg.guild.id, userID: this.msg.author.id}, async (err, res) => {
      if (!res) {
        MessageMap2.set(this.msg.channel.id, 1);
        new Database({SunucuID: this.msg.guild.id, userID: this.msg.author.id, ToplamMesaj: MessageMap2, MessageNumber: 1, ToplamSes: new Map(), VoiceNumber: 0}).save();
      } else {
        res.ToplamMesaj.set(this.msg.channel.id, (Number(res.ToplamMesaj.get(this.msg.channel.id) || 0) + 1));
        res.MessageNumber++;
        res.save();
      };
    });
    await client._updateTask(this.msg.guild.id,this.msg.author.id,"mesaj",1)

    const allah = await client._staff(this.msg.author.id)
if(allah === false) return

    let query = {guildID: this.msg.guild.id,userID: this.msg.author.id}
    await Point.findOneAndUpdate({guildID: this.msg.guild.id,userID: this.msg.author.id}, {$inc: {staffPoint: 1} }, {upsert: true}).exec()

    const guild = this.msg.guild
    const embed = new MessageEmbed().setColor("#00eeff")

      const user = guild.members.cache.get(this.msg.author.id)
    let newCoinn = await Point.findOne({guildID: this.msg.guild.id,userID: this.msg.author.id}).exec()
    if(newCoinn && settings._ROLES.some(x => x._required >= newCoinn.staffPoint)) {
      let roles = settings._ROLES.filter(x => newCoinn.staffPoint >= x._required)
      roles = roles[roles.length-1]
      if(roles && !user.roles.cache.has(roles._id)) {
        const oldRank = settings._ROLES[settings._ROLES.indexOf(roles)-1]
        user.roles.add(roles._id);
      if(oldRank && user.roles.cache.has(oldRank._id)) {
      user.roles.remove(oldRank._id)
      guild.channels.cache.get("869662365854101594").send(embed.setDescription(`:tada: ${user} tebrikler, ** ${roles._required}** puana ulaştığınız için  <@&${roles._id}> yetkisine sahip oldunuz.`))
      }
      }
    
    }  
    


  }
}

module.exports.event = {
  name: "message",
  eventOn: message => new Message(message).MessageStats()
};
