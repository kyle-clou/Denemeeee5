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
            name: `__**Ses ??statistikleri**__`,
            value: `${!voiceList || voiceList.length < 1 ? `Sunucudaki \`Toplam Ses\` S??ralamas??` : `**??lk ${voiceList.length} ki??i ve verileri:**`}\n${voiceList.join("\n") || "Sunucuda ses verileri bulunamad??."}\n\n${!weeklyVoice || weeklyVoice.length < 1 ? "Sunucudaki \`Haftal??k Ses\` S??ralamas??" : `**Haftal??k ses s??ralamas??ndaki ilk ${weeklyVoice.length} ki??i ve verileri:**`}\n${weeklyVoice.join("\n") || "Sunucuda ses verisi bulunamad??."}`,
            inline: false
          },
          {
            name: `__**Mesaj ??statistikleri**__`,
            value: `${!messageList || messageList.length < 1 ? "Sunucudaki \`Toplam Mesaj\` S??ralamas??" : `**??lk ${messageList.length} ki??i ve verileri:**`}\n${messageList.join("\n") || "Sunucuda mesaj verisi bulunamad??."}`,
            inline: false
          },
       {
         name: `__**R??l??n??zdeki Ses S??ralamas??**__`,
         value: `${!roltoplamSes || roltoplamSes.length < 1 ? `R??l??n??zdeki \`Toplam Ses\` S??ralamas??` : `**??lk ${roltoplamSes.length} ki??i ve verileri:**`}\n(${rolu})\n${roltoplamSes.join("\n") || "R??l??n??zde herhangi bir ??yeye ait ses verisi bulamad??m."}`,
         inline: false
        },

        {
         name: `__**R??l??n??zdeki Mesaj S??ralamas??**__`,
         value: `${!roltoplamMesaj || roltoplamMesaj.length < 1 ? "R??l??n??zdeki \`Toplam Mesaj\` S??ralamas??" : `**??lk ${roltoplamMesaj.length} ki??i ve verileri:**`}\n(${rolu})\n${roltoplamMesaj.join("\n") || "R??l??n??zde herhangi bir ??yeye ait mesaj verisi bulamad??m."}`,
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
