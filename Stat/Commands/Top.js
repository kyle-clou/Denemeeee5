const { MessageEmbed } = require("discord.js");
const bruh = require('../../Moderation/Configs/guildSystem')
module.exports.operate = async ({ client, msg, args, author, uye, cfg }, Database = require("../models/stat.js"), parseTime = client.parseTime) => {
  Database.find({ SunucuID: msg.guild.id }, async (err, res) => {
    res = res.filter(x => msg.guild.members.cache.get(x.userID));
    const rolu = msg.member.roles.highest;
    let roldekim;
    roldekim = res.filter(x => (msg.guild.members.cache.get(x.userID)) && (msg.guild.members.cache.get(x.userID).roles.cache.get(rolu.id)));
    const roltoplamSes = roldekim.filter(x => (x.VoiceNumber) !== 0).sort((x, y) => (y.VoiceNumber) - (x.VoiceNumber)).map((x, i) => `\`${i + 1}.\` ${msg.guild.members.cache.get(x.userID)} - (**${parseTime(x.VoiceNumber)}**) `).splice(0, 3);
    const roltoplamMesaj = roldekim.filter(x => (x.MessageNumber) !== 0).sort((x, y) => (y.MessageNumber) - (x.MessageNumber)).map((x, i) => `\`${i + 1}.\` ${msg.guild.members.cache.get(x.userID)} - (**${x.MessageNumber} mesaj**)`).splice(0, 3);


    const voiceList = res.filter(x => x && x.VoiceNumber !== 0).sort((x, y) => y.VoiceNumber - x.VoiceNumber).map((val, i) =>`\`${i + 1}.\` ${msg.guild.members.cache.get(val.userID)} - (\`${parseTime(val.VoiceNumber)}\`)`).splice(0,10);
    const messageList = res.filter(x => x && x.MessageNumber !== 0).sort((x, y) => y.MessageNumber - x.MessageNumber).map((val, i) =>`\`${i + 1}.\` ${msg.guild.members.cache.get(val.userID)} - (\`${val.MessageNumber} mesaj\`)`).splice(0, 10);
   
    const weeklyVoice = res.filter(x => {let uyeToplam = 0;x.ToplamSes.forEach(saat => {uyeToplam += saat;});return uyeToplam !== 0;}).sort((x, y) => {let total1 = 0;y.ToplamSes.forEach(x => (total1 += x));let total2 = 0;x.ToplamSes.forEach(x => (total2 += x));return total1 - total2;}).map((value, index) => {let totalaq = 0;value.ToplamSes.forEach(x => (totalaq += x));return `\`${index + 1}.\` ${msg.guild.members.cache.get(value.userID).toString()} - (\`${parseTime(totalaq)}\`)`;}).slice(0, 3);
    const weeklyMessage = res.filter(x => {let uyeToplam = 0;x.ToplamMesaj.forEach(saat => {uyeToplam += saat;});return uyeToplam !== 0;}).sort((x, y) => {let total1 = 0;y.ToplamMesaj.forEach(x => (total1 += x));let total2 = 0;x.ToplamMesaj.forEach(x => (total2 += x));return total1 - total2;}).map((value, index) => {let totalaq = 0;value.ToplamMesaj.forEach(x => (totalaq += x));return `\`${index + 1}.\` ${msg.guild.members.cache.get(value.userID).toString()} - (\`${totalaq} mesaj\`)`;}).slice(0, 5);
    msg.channel.send({
      embed: {
        author: {
          name: msg.guild.name,
          icon_url: msg.guild.iconURL({ dynamic: true })
        },
        fields: [
          {
            name: `__**Ses İstatistikleri**__`,
            value: `${!voiceList || voiceList.length < 1 ? `Sunucudaki \`Toplam Ses\` Sıralaması` : `**İlk ${voiceList.length} kişi ve verileri:**`}\n${voiceList.join("\n") || "Sunucuda ses verileri bulunamadı."}\n\n${!weeklyVoice || weeklyVoice.length < 1 ? "Sunucudaki \`Haftalık Ses\` Sıralaması" : `**Haftalık ses sıralamasındaki ilk ${weeklyVoice.length} kişi ve verileri:**`}\n${weeklyVoice.join("\n") || "Sunucuda ses verisi bulunamadı."}`,
            inline: false
          },
          {
            name: `__**Mesaj İstatistikleri**__`,
            value: `${!messageList || messageList.length < 1 ? "Sunucudaki \`Toplam Mesaj\` Sıralaması" : `**İlk ${messageList.length} kişi ve verileri:**`}\n${messageList.join("\n") || "Sunucuda mesaj verisi bulunamadı."}`,
            inline: false
          },
       {
         name: `__**Rölünüzdeki Ses Sıralaması**__`,
         value: `${!roltoplamSes || roltoplamSes.length < 1 ? `Rölünüzdeki \`Toplam Ses\` Sıralaması` : `**İlk ${roltoplamSes.length} kişi ve verileri:**`}\n(${rolu})\n${roltoplamSes.join("\n") || "Rölünüzde herhangi bir üyeye ait ses verisi bulamadım."}`,
         inline: false
        },

        {
         name: `__**Rölünüzdeki Mesaj Sıralaması**__`,
         value: `${!roltoplamMesaj || roltoplamMesaj.length < 1 ? "Rölünüzdeki \`Toplam Mesaj\` Sıralaması" : `**İlk ${roltoplamMesaj.length} kişi ve verileri:**`}\n(${rolu})\n${roltoplamMesaj.join("\n") || "Rölünüzde herhangi bir üyeye ait mesaj verisi bulamadım."}`,
         inline: false
        }

        ],
        color: `${
          client.favoriRenkler[
            Math.floor(Math.random() * client.favoriRenkler.length)
          ]
        }`,
        timestamp: new Date(),
        footer: {text:bruh.embedFooter,icon_url: msg.guild.iconURL({dynamic:true})},
        thumbnail: { url: msg.author.avatarURL({ dynamic: true }) }
      }
    });
  });
};

module.exports.help = {
  name: "topstat",
  alias: ["tstat", "top","topstats","TopStat","TOPSTAT","TopStats","Topstat","TOPSTATS"]
};
