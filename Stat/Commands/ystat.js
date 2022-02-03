module.exports.operate = async ({client, msg, args, author, uye, cfg}, {MessageEmbed} = require('discord.js') , Database = require("../models/stat.js"), coin = require("../models/staffSystem"), parseTime = client.parseTime) => {
    const kullanici = (uye || author);
    const yetkiData = require('../../Moderation/Models/ÖzelKomut/yetkirank')
    const othersData = require('../models/otherSettings')
    const register = require('../../Moderation/Models/Register/register')
    const allah = await client._staff(kullanici.id)
if(allah === false) return
    let embed2 = new MessageEmbed().setColor(client.favoriRenkler[Math.floor(Math.random() * client.favoriRenkler.length)]).setAuthor(kullanici.user.tag, kullanici.user.displayAvatarURL({dynamic:true})).setThumbnail(msg.guild.iconURL({dynamic:true}));
    Database.findOne({ SunucuID: msg.guild.id, userID: kullanici.id}, async (err, res) => {
      if (!res) return msg.channel.send(embed2.setDescription('Üyenin herhangi bir verisi bulunamadı.')).then(m => m.delete({ timeout: 6000 }));
      const allChannels = [], mesajSayisi = [];
      let weeklyMessage = 0,weeklyYonetim = 0, toplamKanalSayisi = 0,totalCategory = 0,stream = 0,vk = 0,dc = 0,music = 0,sorun = 0,terapi = 0, weeklyVoice = 0, otherRooms = 0 , weeklyPublic = 0, weeklyAlone = 0, weeklyRegister = 0, weeklySecret = 0, weeklySleep = 0, weeklyGame = 0, totalVoice = (parseTime(res.VoiceNumber) || 0 + " saniye"), totalMessage = ((res.MessageNumber) || 0);
      res.ToplamMesaj.forEach(x => weeklyMessage += x);
      res.ToplamMesaj.forEach((val, key) => mesajSayisi.push({ kanal: key, sayi: val }));
        Array.from(res.ToplamSes).forEach(([key, value]) => {
          if(!msg.guild.channels.cache.get(key)) return;
          weeklyVoice += value;
          allChannels.push({ kanal: key, sure: value });
          if ((msg.guild.channels.cache.get(key).parentID === "859858273960198184") && (key !== "859858376446705664")) return weeklyPublic += value; 
         // if (msg.guild.channels.cache.get(key).parentID === "") return weeklyAlone += value; // EKİP
          if (msg.guild.channels.cache.get(key).parentID === "854841713499963432") return weeklyRegister += value; 
          if (msg.guild.channels.cache.get(key).parentID === "859858276446896129  ") return weeklySecret += value;
          if(msg.guild.channels.cache.get(key).parentID === "859858269865246750") return weeklyYonetim += value;
        //  if(msg.guild.channels.cache.get(key).parentID === "") return stream += value;
        //  if(msg.guild.channels.cache.get(key).parentID === "") return music += value;
          //if(msg.guild.channels.cache.get(key).parentID === "") return sorun += value;
          //if(msg.guild.channels.cache.get(key).parentID === "") return terapi += value;
          //if(msg.guild.channels.cache.get(key).parentID === "") return dc += value;
         // if(msg.guild.channels.cache.get(key).parentID === "") return vk += value;
  
          if(msg.guild.channels.cache.get(key).parentID !== null || msg.guild.channels.cache.get(key).parentID !== undefined ) return totalCategory += value;
          if (["859858275444326430"].includes(msg.guild.channels.cache.get(key).parentID)) return weeklyGame += value;
          if (key === "859858376446705664") return weeklySleep += value; 
      });
let yetki = await yetkiData.findOne({serverID: msg.guild.id,exec: kullanici.id}).exec()
if(!yetki) {
yetki = {
  serverID: msg.guild.id,
exec: kullanici.id,
sayi: 0,
rank: new Array()
}
}
let others = await othersData.findOne({guildID: msg.guild.id,userID: kullanici.id}).exec()
if(!others) {
  others = {
    guildID: msg.guild.id,
    userID: kullanici.id,
    tagges: new Array(),
    sayi: 0,
    kayitSayi: 0,
    inviteSayi: 0
  }
}


      const mostActiveChannels = allChannels.sort((x, y) => (y.sure) - (x.sure)).map((value, index) => `\`${index + 1}.\` #${msg.guild.channels.cache.get(value.kanal).name || '#deleted-channel'}: \`${parseTime(value.sure)}\``).splice(0, 5);
      const ilk5 = mesajSayisi.sort((x, y) => (y.sayi) - (x.sayi)).map((val, index) => `\`${index + 1}.\` ${msg.guild.channels.cache.get(val.kanal) || '#deleted-channel'}: \`${val.sayi} mesaj\``).splice(0, 5);
      const pubxparent = allChannels.filter(c => (msg.guild.channels.cache.get(c.kanal).parentID !== null)).sort((x, y) => (y.sure) - (x.sure)).map((value, index) => `\`• ${index+1}.\` <#${msg.guild.channels.cache.get(value.kanal).parentID || '#deleted-channel'}> - \`(${parseTime(value.sure)})\``).splice(0, 3);
      let point = await coin.findOne({guildID: msg.guild.id,userID: kullanici.id}).exec()
      if(!point) {
         point =  new coin({
          guildID: msg.guild.id,
          userID: kullanici.id,
          staffPoint: 0
        }).save()
      }
  const settings = require('../../staff')
        let text = `${Math.round(point.staffPoint)}`
        const maxValue = settings._ROLES[settings._ROLES.indexOf(settings._ROLES.find(x => x._required >= (point ? Math.floor(point.staffPoint) : 0)))] || settings._ROLES[settings._ROLES.length-1];
        let currentRank = settings._ROLES.filter(x => (point ? Math.floor(point.staffPoint) : 0) >= x._required);
        currentRank = currentRank[currentRank.length-1];
  const status = allah === false ? `` : 
  `**─────────────────────────────────**
  ${msg.guild.emojis.cache.find(x => x.name === "shinoa_yildiz")} **Puan Durumu**
  -Puanınız: \`${Math.round(point.staffPoint)}\` Gereken Puan: \`${maxValue._required}\`
  ${await createBar(Math.round(point.staffPoint),maxValue._required,8)}
  
  ${msg.guild.emojis.cache.find(x => x.name === "shinoa_yildiz")} **Yetki Durumu**
  ${currentRank !==  settings._ROLES[settings._ROLES.length-1] ? `Şuan  <@&${currentRank._id}> rolündesiniz <@&${maxValue._id}> rolüne ulaşmak için **${maxValue._required - Math.round(point.staffPoint)}** \`Puan\` kazanman gerekiyor.`: "Şu anda en son yetkili perminde bulunuyorsun, verdiğin emeklerden dolayı teşekkür ederiz."}
  **─────────────────────────────────**`
  const task = require('../models/task')
const arama = await task.findOne({guildID: msg.guild.id,userID: kullanici.id,active: true,comp: false}).exec()
const taskystem = !arama ? 
`**─────────────────────────────────**
${msg.guild.emojis.cache.find(x => x.name === "shinoa_yildiz")} **Görev Durumu**

- Aktif bir görevi bulunmuyor!` : 
`**─────────────────────────────────**
${msg.guild.emojis.cache.find(x => x.name === "shinoa_yildiz")} **Görev Durumu**
- Tür: \`${arama.type}\`
- Miktar: \`${arama.compCount}\` - Gereken Miktar: \`${arama.count}\`
${await createBar(Math.round(arama.compCount),arama.count,8)}`

      embed2.setDescription(`
      <@${kullanici.user.id}> kullanıcısının yetki yükseltim bilgileri aşağıda belirtilmiştir.,

**❯ Bilgiler**
\`•\` Toplam Puanınız: \`${Math.round(point.staffPoint)}\`


      **❯ Ses Bilgileri:**
      \`•\` Public Odaları: \`${parseTime(weeklyPublic)}\`
      \`•\` Yönetim Odaları: \`${parseTime(weeklyYonetim)}\`
      \`•\` Secret Odaları: \`${parseTime(weeklySecret)}\`
      \`•\` Kayıt Odaları: \`${parseTime(weeklyRegister)}\`
      \`•\` Oyun Odaları: \`${parseTime(weeklyGame)}\` 
      \`•\` Sleep Odası: \`${parseTime(weeklySleep)}\`
      \`•\` Stream Odaları: \`${parseTime(stream)}\` **(Kapalı)**
      \`•\` Müzik Odaları: \`${parseTime(music)}\` **(Kapalı)**
      \`•\` Sorun Çözme: \`${parseTime(sorun)}\` && Terapi Odaları: \`${parseTime(terapi)}\` **(Kapalı)**
      \`•\` VK : \`${parseTime(vk)}\` && DC Odaları: \`${parseTime(dc)}\` **(Kapalı)**
  
      **❯ Mesaj Bilgileri:**
      \`•\` Genel Mesaj: \`0\`

      **❯ Diğer Bilgileri:**
      \`•\` Yetkili Alım Miktari: \`${yetki.sayi}\`
      \`•\` Taglı üye: \`${others.sayi}\`
      \`•\` Kayıt Miktari: \`${others.kayitSayi}\`
      \`•\` Davet Miktari: \`${others.inviteSayi}\`
      ${taskystem}
      ${status}
      `)
      msg.channel.send(embed2);
    });
    async function createBar(current, required, total = 8) {
      let percentage = (100 * current) / required;
      percentage = percentage > 100 ? 100 : percentage;
    
    let Fillstart = `${msg.guild.emojis.cache.find(x => x.name === "lewis_bar1")}`
    let emptyStart = `${msg.guild.emojis.cache.find(x => x.name === "lewis_bos3")}`
    let fillCenter = `${msg.guild.emojis.cache.find(x => x.name === "lewis_bar2")}`
    let emptyCenter = `${msg.guild.emojis.cache.find(x => x.name === "lewis_bos2")}`
    let fillEnd = `${msg.guild.emojis.cache.find(x => x.name === "lewis_bar3")}`
    let emptyEnd = `${msg.guild.emojis.cache.find(x => x.name === "lewis_bos1")}`
      let str = "";
      const progress = Math.round((percentage / 100) * total);
      str += percentage > 0 ? Fillstart : emptyStart;
      str += fillCenter.repeat(progress);
      str += emptyCenter.repeat(8 - progress);
      str += percentage === 100 ? fillEnd: emptyEnd;
    
      return str;
    }
  };
  
  module.exports.help = {
    name: "ystat",
    alias: ["yetkili-stat","yetkilistat"]
  };
  
  
  
  
  