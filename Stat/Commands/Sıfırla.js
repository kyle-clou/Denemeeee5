const config = require('../../Moderation/Configs/mainSettings')


const { MessageEmbed } = require("discord.js");
module.exports.operate = async ({client, msg, args, author, uye, cfg}, Database = require("../models/stat.js")) => {
  if (!config.owners.includes(author.id)) return;
  if (!uye) return;
  let type = args[1];
  let embed = new MessageEmbed().setColor(client.favoriRenkler[Math.floor(Math.random() * client.favoriRenkler.length)]).setAuthor(uye.user.tag, uye.user.displayAvatarURL({dynamic:true})).setTimestamp().setThumbnail(msg.guild.iconURL({dynamic:true}));
  Database.findOne({SunucuID: msg.guild.id, userID: uye.id} , async (err, Veri) => {
    if (!type) {
      if (Veri) {
        await Database.deleteOne({ _id: Veri._id });
        client.VoiceMap.delete(uye.id);
        client.MessageMap.delete(uye.id);
        msg.channel.send(embed.setDescription(`\`Veri Silme Başarılı!\`\n**Belirttiğiniz üyenin bütün ses ve mesaj verileri silindi.**`))
      } else {
        msg.channel.send(embed.setDescription("\`Veri Silme Başarısız!\`\n**Belirttiğiniz üyenin hiçbir ses ve mesaj verisi bulunamadı.\nDatabase'de bu kullanıcıya ait veriler tekrar aranmaya başlanılıyor...\nBu işlem 10-15 saniye sürebilir.**")).then(x => setTimeout(function(){
          x.edit(embed.setDescription("Kullanıcıya ait veri arama işlemi bitti ancak herhangi bir ses ve mesaj verisi bulunamadı."))
        },12000))
      };
    } else if (type === "ses") {
      if ((Veri) && (((Veri.VoiceNumber) !== 0))) {
        Veri.VoiceNumber = 0;
        Veri.ToplamSes = new Map();
        client.VoiceMap.delete(uye.id);
        Veri.save();
        msg.channel.send(embed.setDescription(`\`Veri Silme Başarılı!\`\n**Belirttiğiniz üyenin bütün \`ses\` verileri silindi.**`))
      } else {
        msg.channel.send(embed.setDescription(`\`Veri Silme Başarısız!\`\n**Aradığınız üyenin hiçbir \`ses\` verisi olmadığı için silinemedi.**`))
      };
    } else if (type === "mesaj") {
      if ((Veri) && (((Veri.MessageNumber) !== 0))) {
        Veri.MessageNumber = 0;
        Veri.ToplamMesaj = new Map();
        client.MessageMap.delete(uye.id);
        Veri.save();
        msg.channel.send(embed.setDescription(`\`Veri Silme Başarılı!\`\n**Belirttiğiniz üyenin bütün \`mesaj\` verileri silindi.**`))
      } else {
        msg.channel.send(embed.setDescription(`\`Veri Silme Başarısız!\`\n**Belirttiğiniz üyenin hiçbir \`mesaj\` verisi olmadığı için silinemedi.**`))  
      };
    };
  });
};

module.exports.help = {
  name: "sıfırla",
  alias: ["stat-temizle","stat-Sıfırla","stat-delete","stat-sıfırla","stat-SIFIRLA","sıfırla-stat","stat-sil"]
};