const parsems =  require("parse-ms");
const config = require('../../Moderation/Configs/guildSystem')
const Settings = require('../../Moderation/Configs/moderation')
const {GuildMember,MessageEmbed} = require('discord.js');
const task = require("../models/task");
module.exports = (client, cfg, moment) => {
    
  client.favoriRenkler = new Array("#dc143c","#1f0524","#0b0067","#4a0038","#07052a","#FFDF00","#00FFFF","#0091CC","#0047AB","#384B77","#04031a","#f9ffba","#FD0061","#4B0082","#0000FF","#00FFFF","#000080","#FFFACD","#F8F8FF","#160101","#901F76","#7FFFD4", "#36393f");
  const Point = require('../models/staffSystem')
  const settings = require('../../staff')

  client.voiceCount = async ({Database, userID, channelID, time}) => {
    let voiceMap = new Map();
    let chatMap = new Map();
    Database.findOne({SunucuID: config.guildID, userID: userID}, async (err, res) => {
      if (!res) {
        if (channelID === null) return;
        voiceMap.set(channelID, time);
        new Database({SunucuID: config.guildID, userID: userID, ToplamMesaj: chatMap, MessageNumber: 0, ToplamSes: voiceMap, VoiceNumber: time}).save();
      } else {
        if (channelID === null) return;
        let data = res.ToplamSes.get(channelID) || 0;
        res.ToplamSes.set(channelID, Number(data + time));
        res.VoiceNumber = Number(res.VoiceNumber) + time;
        res.save();
      };
    });
    if(channelID === "855922644406501407") return

    const guild =  client.guilds.cache.first()

    await client._updateTask(guild.id,userID,"ses",time)


    const allah = await client._staff(userID)
if(allah === false) return
const chnl = guild.channels.cache.get(channelID).parentID
let query =  {guildID: guild.id,userID: userID}
if(chnl) {
  let selam = settings._CHANNEL.find(x => x._catID === chnl)
  if(selam) {
    let selamm = (time / (selam._duration *60000)) * selam._point
    await Point.findOneAndUpdate(query, {$inc: {staffPoint: selamm} }, {upsert: true}).exec()
  } else {
     let mrb = (time / (60000))

    await Point.findOneAndUpdate(query, {$inc: {staffPoint: mrb} }, {upsert: true}).exec()
  }
} else {
 let slm = (time / (60000))
  await Point.findOneAndUpdate(query, {$inc: {staffPoint: slm} }, {upsert: true}).exec()

}
const embed = new MessageEmbed().setColor("#00eeff")


  const user = guild.members.cache.get(userID)
let newCoinn = await Point.findOne(query).exec()
if(newCoinn && settings._ROLES.some(x => x._required >= newCoinn.staffPoint)) {
  let roles = settings._ROLES.filter(x => newCoinn.staffPoint >= x._required)
  roles = roles[roles.length-1]
if(roles && !user.roles.cache.has(roles._id)) {
  const oldRank = settings._ROLES[settings._ROLES.indexOf(roles)-1]
  user.roles.add(roles._id);
  user.roles.add(roles._hammers)
if(oldRank && user.roles.cache.has(oldRank._id)) {
user.roles.remove(oldRank._id)
guild.channels.cache.get("855922642678972421").send(embed.setDescription(`:tada: ${user} tebrikler, ** ${roles._required}** puana ulaştığınız için  <@&${roles._id}> yetkisine sahip oldunuz.`))
}
}

}  













  };
  
  client.splitEmbedWithDesc = async function(description, author = false, footer = false, features = false) {
    const { MessageEmbed, Message } = require("discord.js")
  let embedSize = parseInt(`${description.length/2048}`.split('.')[0])+1
  let embeds = new Array()
  for (var i = 0; i < embedSize; i++) {
    let desc = description.split("").splice(i*2048, (i+1)*2048)
    let x = new MessageEmbed().setDescription(desc.join(""))
    if (i == 0 && author) x.setAuthor(author.name, author.icon ? author.icon : null)
    if (i == embedSize-1 && footer) x.setFooter(footer.name, footer.icon ? footer.icon : null)
    if (i == embedSize-1 && features && features["setTimestamp"]) x.setTimestamp(features["setTimestamp"])
    if (features) {
      let keys = Object.keys(features)
      keys.forEach(key => {
        if (key == "setTimestamp") return
        let value = features[key]
        if (i !== 0 && key == 'setColor') x[key](value[0])
        else if (i == 0) {
          if(value.length == 2) x[key](value[0], value[1])
          else x[key](value[0])
        }
      })
    }
    embeds.push(x)
  }
  return embeds
};
  
client._staff = async function(_id) {
  let teamAmerica =  client.guilds.cache.first()
  const _member = teamAmerica.members.cache.get(_id)
if(!_member) {
  return false
}
const _staffRoles = settings._ROLES
const roles = []
const control = _staffRoles.forEach(async x => {
   roles.push(x._id)
}) 
if(roles.some(x => _member.roles.cache.has(x))) return true 
else return false
}

client._hasSystem = async function() {
if(settings._STAFF_SYSTEM._SYSTEM) return true
else return false 
}
client._addPoint = async function(userQuery = {},catID,value) {

  let selam = settings._CHANNEL.find(x => x._catID ===catID)
  if(selam) {
    let selamm = Math.round(value / (selam._duration *60000)) * selam._point

     Point.findOneAndUpdate({userQuery}, {$inc: {staffPoint: selamm} }, {upsert: true}).exec()
  } else {
    await Point.findOneAndUpdate({userQuery}, {$inc: {staffPoint: 5} }, {upsert: true}).exec()
  }
  return true
  }





  client.parseTime = time => {
    var x = "";
    var y = parsems(time);
    if (y.days !== 0) {
      x = `${y.days*24 + y.hours} saat ${y.minutes} dakika ${y.seconds} saniye`;
    } else if (y.hours !== 0) {
      x = `${y.hours} saat ${y.minutes} dakika ${y.seconds} saniye`;
    } else if (y.minutes !== 0) {
      x = `${y.minutes} dakika ${y.seconds} saniye`;
    } else if (y.seconds !== 0) {
      x = `${y.seconds} saniye`;
    } else x = `0 saniye`;
    return x;
  };
  
  client.getDate = (date, type) => {
    let sure;
    date = Number(date);
    if (type === "saniye") { sure = (date * 1000) }
    else if (type === "dakika") { sure = (60 * 1000) * date }
    else if (type === "saat") { sure = ((60 * 1000) * 60) * date }
    else if (type === "gün") { sure = (((60 * 1000) * 60) * 24) * date }
    else if (type === "hafta") { sure = ((((60 * 1000) * 60) * 24) * 7) * date }
    else if (type === "ay") { sure = ((((60 * 1000) * 60) * 24) * 30) * date }
    else if (type === "yıl") { sure = ((((((60 * 1000) * 60) * 24) * 30) * 12) + 5) * date };
    return sure;
  };
  
   client.clean =  text => {
     if (typeof text !== "string")
     text = require("util").inspect(text, { depth: 0 });
	   text = text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	   return text;
   };
   const tasks = [
     {type: "davet",count: 2,prize: 5},
     {type: "mesaj",count: 10,prize: 10},
     {type: "ses",count: 20*1000,prize: 5},

   ]

   




const task = require('../models/task')
   client.newTask = async function(guildID) {
    const guild = client.guilds.cache.get(guildID)

const üyeler = guild.members.cache.array()
for(let i = 0; i < üyeler.length; i++) {
  let allah = await client._staff(üyeler[i].id)

      if(allah === true) {

        const x = guild.members.cache.get(üyeler[i].id)
        const randoms = tasks.random()
     new task({guildID: guild.id,userID: x.id,type: randoms.type,count: randoms.count,prize: randoms.prize,active: true,comp: false}).save()
     const embed = new MessageEmbed().setColor("#00eeff")
     
     if(randoms.type === "davet") {
     embed.setDescription(`${x} Bügünkü yeni görevin **${randoms.count}** tane üyeyi sunucumuza davet etmek, bitirdiğinde \`${randoms.prize}\` point kazanacaksın!`)
     guild.channels.cache.get("885940216278417428").send(`${x}`,{embed: embed})
     
     } else if(randoms.type === "mesaj") {
     embed.setDescription(`${x} Bügünkü yeni görevin ${guild.channels.cache.find(x => x.name === Settings.guildChannels.chat)} kanalında  **${randoms.count}** tane mesaj yazmak, bitirdiğinde \`${randoms.prize}\` point kazanacaksın! `)
     guild.channels.cache.get("885940216278417428").send(`${x}`,{embed: embed})
     } else if(randoms.type === "ses") {
     embed.setDescription(`${x} Bügünkü yeni görevin ${client.parseTime(randoms.count)}  ses kanallarında aktiflik yapman gerekiyor, bitirdiğinde \`${randoms.prize}\` point kazanacaksın!`)
     guild.channels.cache.get("885940216278417428").send(`${x}`,{embed: embed})
     } else if(randoms.type === "taglı") {
     embed.setDescription(`${x} Bügünkü yeni görevin ${client.parseTime(randoms.count)} tane tagımıza üye çekmen gerekiyor!, bitirdiğinde \`${randoms.prize}\` point kazanacaksın!`)
     guild.channels.cache.get("885940216278417428").send(`${x}`,{embed: embed})
     }




      }

}
return true
    }


    client._updateTask = async function(guildID,user,shinoa,count) {
      let allah = await client._staff(user)
      const embed = new MessageEmbed().setColor("#00eeff")
      if(allah === false) return
      const guild = client.guilds.cache.get(guildID)
    let selam = await task.findOne({guildID: guild.id,userID: user,type: shinoa,active: true,comp: false})
      if(selam) {
        await task.findOneAndUpdate({guildID: guild.id,userID: user,type: shinoa,active: true,comp: false}, {$inc: {compCount: count} }, {upsert: true}).exec()
 
        if(selam.compCount >= selam.count) {
          embed.setDescription(`<@${user}> Kişisi  \`${shinoa}\` görevini bitirdiği için ona **${selam.prize}** point verdim! `)
          guild.channels.cache.get("885940283093696532").send(embed)
  
          selam.active = false
          selam.comp = true
          let query =  {guildID: guildID,userID: user}
          await Point.findOneAndUpdate(query, {$inc: {staffPoint: selam.prize} }, {upsert: true}).exec()
          selam.save()
        }
      } 
    
    }
client.taskKapat = async function(guildID) {
  let selam = await task.updateMany({guildID: guildID}, {$set: {active: false}})
}
};



GuildMember.prototype.hasRole = function (role, every = true) {
  return (
    (Array.isArray(role) &&
      ((every && role.every((x) => this.roles.cache.has(x))) ||
        (!every && role.some((x) => this.roles.cache.has(x))))) ||
    (!Array.isArray(role) && this.roles.cache.has(role))
  );
};

Array.prototype.random = function () {
  return this[Math.floor((Math.random() * this.length))];
};