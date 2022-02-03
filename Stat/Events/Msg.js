const client = process.client;
const cfg = require("../index.json");
const config = require('../../Moderation/Configs/guildSystem')

class Command {
  constructor(msg) {
    this.msg = msg;
  }

  async useCommand() {
    if (!Array.isArray(cfg.prefixes)) cfg.prefixes = [cfg.prefixes];
    if (!cfg.prefixes.some(x => this.msg.content.startsWith(x.toLowerCase()))) return;
    if (this.msg.author.bot || this.msg.guild.id !== config.guildID || this.msg.channel.type === "dm") return;
    let args = this.msg.content.slice(cfg.prefixes.some(x => x.toLowerCase().length)).trim().split(/ +/g);
    let command = args.shift().toLowerCase();
    let author = this.msg.guild.member(this.msg.author);
    let uye = this.msg.guild.member(this.msg.mentions.users.first()) || this.msg.guild.members.cache.get(args[0]);
    let cmd;
    if (client.commands.has(command)) {
      cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
      cmd = client.commands.get(client.aliases.get(command));
    };
    if (cmd) {
      cmd.operate({ client: client, msg: this.msg, args: args, author: author, uye: uye, cfg: cfg });
    };
  }
}

module.exports.event = {
  name: "message",
  eventOn: message => new Command(message).useCommand()
};