const { MessageEmbed } = require("discord.js");

module.exports.operate = async ({client, msg, args, author, uye, cfg}, Database = require("../models/stat.js"), parseTime = client.parseTime) => {
  const bruh = require('./../../Moderation/Configs/guildSystem')

  let rol = msg.mentions.roles.first() || msg.guild.roles.cache.get(args[0]);
  let currentPage = 1;
  const embed2 = new MessageEmbed().setColor(client.favoriRenkler[Math.floor(Math.random() * client.favoriRenkler.length)]).setAuthor(msg.guild.name, msg.guild.iconURL({dynamic: true}));
  if ((!rol) || (rol.length < 1)) return msg.channel.send(embed2.setFooter(bruh.embedFooter).setDescription("Hatalı Kullanım!\nGeçerli bir rol ID'si girmelisin veya bir rol etiketlemelisin.")).then(msj => msj.delete({ timeout: 5000 }));
  let embed = new MessageEmbed().setColor(rol.hexColor).setAuthor(msg.guild.name, msg.guild.iconURL({dynamic: true}));
  Database.find({ SunucuID: msg.guild.id }, (err, res) => {
    res = res.filter(x => (msg.guild.members.cache.get(x.userID)) && (msg.guild.members.cache.get(x.userID).roles.cache.get(rol.id)));
    const toplamMesaj = res.filter(x => (x.MessageNumber) !== 0).sort((x, y) => (y.MessageNumber) - (x.MessageNumber)).map((x, i) => `\`${i + 1}.\` ${msg.guild.members.cache.get(x.userID)} - (**${x.MessageNumber} mesaj**)`).splice(0, 7);
    const haftalıkMesaj = res.filter(x => { let uyeToplam = 0; x.ToplamMesaj.forEach(qwe => uyeToplam += qwe); return (uyeToplam !== 0) }).sort((x, y) => { let uye1 = 0; y.ToplamMesaj.forEach(qwe => uye1 += qwe); let uye2 = 0; x.ToplamMesaj.forEach(qwe => uye2 += qwe); return (uye1 - uye2); }).map((val, index) => { let uyeToplam = 0; val.ToplamMesaj.forEach(qwe => uyeToplam += qwe); return `\`${index + 1}.\` ${msg.guild.members.cache.get(val.userID)} - (**${uyeToplam} mesaj**) `; }).splice(0, 7)
    const toplamSes = res.filter(x => (x.VoiceNumber) !== 0).sort((x, y) => (y.VoiceNumber) - (x.VoiceNumber)).map((x, i) => `\`${i + 1}.\` ${msg.guild.members.cache.get(x.userID)} - (**${parseTime(x.VoiceNumber)}**) `).splice(0, 7);
    const haftalıkSes = res.filter(x => { let uyeToplam = 0; x.ToplamSes.forEach(qwe => uyeToplam += qwe); return (uyeToplam !== 0) }).sort((x, y) => { let uye1 = 0; y.ToplamSes.forEach(qwe => uye1 += qwe); let uye2 = 0; x.ToplamSes.forEach(qwe => uye2 += qwe); return (uye1 - uye2); }).map((val, index) => { let uyeToplam = 0; val.ToplamSes.forEach(qwe => uyeToplam += qwe); return `\`${index + 1}.\` ${msg.guild.members.cache.get(val.userID)} - (**${parseTime(uyeToplam)}**) `; }).splice(0, 7);
    embed.setDescription(`\`${rol.name}\` **Rolündeki kullanıcıların \`haftalık\` istatistikleri:**`);
    embed.addField("Mesaj İstatistikleri:", `${haftalıkMesaj.join("\n") || '__Veri Bulunamadı.__'}`, false);
    embed.addField("Ses İstatistikleri:",  `${haftalıkSes.join("\n") || '__Veri Bulunamadı.__'}`, false);
    embed.setFooter("Eğer daha fazla veri görmek istiyorsanız veya mesajı silmek istiyorsanız emojileri kullanabilirsiniz.");
    msg.channel.send(embed).then(async msj => {
      await msj.react("◀");
      await msj.react("❌");
      await msj.react("▶");
      const collector = msj.createReactionCollector((react, user) => ["◀","▶", "❌"].some(e => e == react.emoji.name) && user.id == author.id, { time: 200000 });
      collector.on("collect", async reaction => {
          if (reaction.emoji.name === "▶") {
            if (currentPage === 2) return;
            currentPage++;
            let embed2 = new MessageEmbed().setColor(rol.hexColor).setAuthor(msg.guild.name, msg.guild.iconURL({dynamic: true}));
            embed2.setDescription(`\`${rol.name}\` **Rolündeki kullanıcıların \`genel\` istatistikleri:**`)
            embed2.addField("Mesaj İstatistikleri:", `${toplamMesaj.join("\n") || '__Veri Bulunamadı.__'}`, false);
            embed2.addField("Ses İstatistikleri:", `${toplamSes.join("\n") || '__Veri Bulunamadi.__'}`, true);
            await reaction.users.remove(author.id).catch(err => { });
            if (msj) msj.edit(embed2);
          } else if (reaction.emoji.name === "◀") {
            if (currentPage === 1) return;
            let embed2 = new MessageEmbed().setColor(rol.hexColor).setAuthor(msg.guild.name, msg.guild.iconURL({dynamic: true}));
            currentPage--;
            embed2.setDescription(`\`${rol.name}\` **rolündeki kullanıcıların \`haftalık\` istatistikleri:**`)
            embed2.addField("Mesaj İstatistikleri:", `${haftalıkMesaj.join("\n") || '__Veri Bulunamadı.__'}`, false);
            embed2.addField("Ses İstatistikleri:",  `${haftalıkSes.join("\n") || '__Veri Bulunamadı.__'}`, true);
            await reaction.users.remove(author.id).catch(err => { });
            if (msj) msj.edit(embed2);
          } else if (reaction.emoji.name === "❌") {
            collector.stop();
            msj.delete();
          };
     });
  });
});
}

module.exports.help = {
  name: "rolstat",
  alias: ["rstat", "rst", "rols","RolStat","ROLSTAT","rolstats"]
};
