const { MessageEmbed } = require("discord.js");

module.exports.operate = async ({client, msg, args, author, uye, cfg}, Database = require("../models/stat.js"), parseTime = client.parseTime) => {
  let rol = msg.mentions.roles.first() || msg.guild.roles.cache.get(args[0]);
  let currentPage = 1;
  const embed2 = new MessageEmbed().setFooter("totalrolstat @User/ID haftalık => Ek kullanımdır.").setColor(client.favoriRenkler[Math.floor(Math.random() * client.favoriRenkler.length)]).setAuthor(msg.guild.name, msg.guild.iconURL({dynamic: true}));
  if ((!rol) || (rol.length < 1)) return msg.channel.send(embed2.setDescription("Geçerli bir rol ID'si girmeli ya da bir rol etiketlemelisin.")).then(msj => msj.delete({ timeout: 5000 }));
  let embed = new MessageEmbed().setColor(rol.hexColor).setAuthor(msg.guild.name, msg.guild.iconURL({dynamic: true}));
  Database.find({ SunucuID: msg.guild.id }, (err, res) => {
    res = res.filter(x => (msg.guild.members.cache.get(x.userID)) && (msg.guild.members.cache.get(x.userID).roles.cache.get(rol.id)));
    const toplamMesaj = res.filter(x => (x.MessageNumber) !== 0).sort((x, y) => (y.MessageNumber) - (x.MessageNumber)).map((x, i) => `${i + 1}. ${msg.guild.members.cache.get(x.userID)} - (**${x.MessageNumber} mesaj**)`)
    const haftalıkMesaj = res.filter(x => { let uyeToplam = 0; x.ToplamMesaj.forEach(qwe => uyeToplam += qwe); return (uyeToplam !== 0) }).sort((x, y) => { let uye1 = 0; y.ToplamMesaj.forEach(qwe => uye1 += qwe); let uye2 = 0; x.ToplamMesaj.forEach(qwe => uye2 += qwe); return (uye1 - uye2); }).map((val, index) => { let uyeToplam = 0; val.ToplamMesaj.forEach(qwe => uyeToplam += qwe); return `${index + 1}. ${msg.guild.members.cache.get(val.userID)} - (**${uyeToplam} mesaj**) `; })
    const toplamSes = res.filter(x => (x.VoiceNumber) !== 0).sort((x, y) => (y.VoiceNumber) - (x.VoiceNumber)).map((x, i) => `${i + 1}. ${msg.guild.members.cache.get(x.userID)} - (**${parseTime(x.VoiceNumber)}**) `)
    const haftalıkSes = res.filter(x => { let uyeToplam = 0; x.ToplamSes.forEach(qwe => uyeToplam += qwe); return (uyeToplam !== 0) }).sort((x, y) => { let uye1 = 0; y.ToplamSes.forEach(qwe => uye1 += qwe); let uye2 = 0; x.ToplamSes.forEach(qwe => uye2 += qwe); return (uye1 - uye2); }).map((val, index) => { let uyeToplam = 0; val.ToplamSes.forEach(qwe => uyeToplam += qwe); return `${index + 1}. ${msg.guild.members.cache.get(val.userID)} - (**${parseTime(uyeToplam)}**) `; })
    

     if (!args[1]) {
      msg.channel.send(embed.setDescription(`\`${rol.name}\` **rolündeki kullanıcıların \`toplam\` istatistikleri:**\n
    Ses İstatistikleri:
    ${toplamSes.join("\n") || '__Veri Bulunamadı.__'}`))
    msg.channel.send(embed.setDescription(`Mesaj İstatistikleri:
   ${toplamMesaj.join("\n") || '__Veri Bulunamadı.__'}`))
    } else if (args[1] && ["haftalık", "week", "hafta"].includes(args[1])) {
      msg.channel.send(embed.setDescription(`\`${rol.name}\` **rolündeki kullanıcıların \`haftalık\` istatistikleri:**\n
    Ses İstatistikleri:
    ${haftalıkSes.join("\n") || '__Veri Bulunamadı.__'}`))
    msg.channel.send(embed.setDescription(`Mesaj İstatistikleri:
   ${haftalıkMesaj.join("\n") || '__Veri Bulunamadı.__'}`))
    }
  });  
};

module.exports.help = {
  name: "trolstat",
  alias: ["totalrolstat","TotalRolStat","totalrolstats","Totalrolstat","Totalrolstats"]
};    
