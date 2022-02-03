const config = require('../../Moderation/Configs/mainSettings')


module.exports.operate = async ({client, msg, args, author, cfg}) => {
  if (!config.owners.includes(author.id)) return;
  if (!args[0] || args[0].includes("qwe")) return msg.channel.send("uWu");
  const code = args.join(" ");

  try {
    var evaled = client.clean(await eval(code));
    if (evaled.match(new RegExp(`${cfg.qwe}`, "g"))) evaled.replace("token", "?").replace(client.token, "?");
    msg.channel.send(`${evaled.replace(client.token, "?")}`, { code: "js", split: true }).catch(err => msg.channel.send(err.message));
  } catch (err) {
    msg.channel.send(err, { code: "js", split: true });
  };
};

module.exports.help = {
  name: "stateval",
  alias: ['statseval',"eval"]
};