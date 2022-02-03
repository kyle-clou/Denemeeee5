
const config = require('../../Moderation/Configs/guildSystem')

module.exports = (CronJob, Database, client, cfg) => {
  var sure = new CronJob("00 00 00 * * 0", function() {
    const guild = client.guilds.cache.get(config.guildID);
    Database.updateMany({SunucuID: guild.id }, { ToplamMesaj: new Map(), ToplamSes: new Map() });
    Database.find({SunucuID: guild.id}).filter(d => !guild.members.cache.has(d.userID)).forEach(q => Database.findByIdAndDelete(q._id));
  }, null, true, "Europe/Istanbul");
  sure.start();
};