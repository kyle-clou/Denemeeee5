const { copyFileSync } = require("fs");


const { Client, Permissions, Guild } = require("discord.js"),
Guard = new Client(),
Mongoose = require("mongoose"),
Config = require("../GuardConfig.json"),
tokens = require("../tokens.js"),
Bots = [],
PermArray = ["ADMINSTRATOR", "KICK_MEMBERS", "MANAGE_GUILD", "BAN_MEMBERS", "MANAGE_ROLES", "MANAGE_WEBHOOKS", "MANAGE_NICKNAMES", "MANAGE_CHANNELS"];
let danger = false,
Roles = [],
presence = Config.botAyar.presence,
MongoURL = Config.MongoURL;
Mongoose.connect(MongoURL, {
useNewUrlParser: true,
useUnifiedTopology: true,
useFindAndModify: false
});

Array.prototype.shuffle = function () {
	// i = value
	let i = this.length;
	while (i) {
	  let j = Math.floor(Math.random() * i);
	  let t = this[--i];
	  this[i] = this[j];
	  this[j] = t;
	}
	return this;
  };

const RoleSchema = new Mongoose.Schema({ ServerID: String , Name: String, Id: String,permissions: Number,Color: String,channelOverwrites : Array,position : Number,Members: { type: Array, default: [] } }),
	RoleModel = Mongoose.model("2_backupm2", RoleSchema),
	ChannelSchema = new Mongoose.Schema({ ServerID: String ,Name: String,Id: String, Type: String, position: Number,Permissions: { type: Array, default: [] }, Parent: { type: String, default: null } }),
	ChannelModel = Mongoose.model("2_backupchannel", ChannelSchema),
    Database = require("./models/role.js");

function guvenli(kisiID) {
    let uye = Guard.guilds.cache.get(Config.guildID).members.cache.get(kisiID);
    let guvenliler = Config.whitelist || [];
    if (!uye || uye.id === Guard.user.id  || uye.id === uye.guild.owner.id || guvenliler.some(g => uye.id === g.slice(1) || uye.roles.cache.has(g.slice(1)))) return true
    else return false;
  };

async function backup() {
	let Guild = Guard.guilds.cache.get(Config.guildID);

	Guild.roles.cache.filter(role => !role.managed && role.members.size > 5).forEach(async function(rol){

		let roleChannelOverwrites = []
	Guild.channels.cache.filter(c => c.permissionOverwrites.has(rol.id)).forEach(c => {
		let channelPerm = c.permissionOverwrites.get(rol.id);
		let oxmiaf = { id: c.id, allow: channelPerm.allow.toArray(), deny: channelPerm.deny.toArray() };
		roleChannelOverwrites.push(oxmiaf);
	  });

		await RoleModel.findOne({ServerID: Config.guildID , Id: rol.id}, async function(err,response){
			if(!response){
				let newData = await new RoleModel({
					_id: new Mongoose.Types.ObjectId(),
					ServerID: Config.guildID,
					Members: rol.members.filter(xw => !xw.user.bot).map(xx => xx.id),
					permissions: rol.permissions,
					Name: rol.name,
					Color: rol.color,
					position: rol.position,
					channelOverwrites: roleChannelOverwrites
				});
				newData.save();
			}else {
				response.ServerID = Config.guildID,
				response.Members = rol.members.filter(x=> !x.user.bot).map(y => y.id)
				response.Name = rol.name
				response.Color = rol.color
				response.position = rol.position
				response.channelOverwrites = roleChannelOverwrites
				response.permissions = rol.permissions
				response.save();
			}
		})
	});

	Guild.channels.cache.filter(x => x.parentID !== null).forEach(async function(kanal){
		ChannelModel.findOne({ServerID: Config.guildID , Id: kanal.id}, async function(err,res){
			if(!res){
				let yeniData = await new ChannelModel({
					_id: new Mongoose.Types.ObjectId(),
					ServerID: Config.guildID,
					Id: kanal.id,
					Type: kanal.type,
					position: kanal.position,
					Permissions: kanal.permissionOverwrites.array().map((perm) => {
						return {
							id: perm.id,
							type: perm.type,
							allow: new Permissions(perm.allow.bitfield).toArray(),
							deny: new Permissions(perm.deny.bitfield).toArray()
						};
					}),
					Parent: kanal.parentID
				});
				yeniData.save();
			}else {
				res.ServerID = Config.guildID,
				res.Id = kanal.id
				res.Type = kanal.type
				res.position = kanal.position
				res.Permissions = kanal.permissionOverwrites.array().map(perm => {
					return {
						id: perm.id,
						type: perm.type,
						allow: new Permissions(perm.allow.bitfield).toArray(),
						deny: new Permissions(perm.deny.bitfield).toArray()
					}
				})
				res.Parent = kanal.parentID
				res.save();
			}

		})
	});
}



async function DataTwoBackup(){
    let guild = Guard.guilds.cache.get(Config.guildID);
    if(guild){
        guild.roles.cache.filter(r => r.name !== "@everyone" && !r.managed).forEach(role => {
            let roleChannelOverwrites = []
            guild.channels.cache.filter(c => c.permissionOverwrites.has(role.id)).forEach(c => {
                let channelPerm = c.permissionOverwrites.get(role.id);
                let pushlanacak = { id: c.id, allow: channelPerm.allow.toArray(), deny: channelPerm.deny.toArray() };
                roleChannelOverwrites.push(pushlanacak);
              });
    
            Database.findOne({guildID : Config.guildID, roleID : role.id}, async function(err,res){
                if(!res){
                    let yeniData = new Database({
                        _id: new Mongoose.Types.ObjectId(),
                        guildID: Config.guildID,
                        roleID: role.id,
                        name: role.name,
                        color: role.hexColor,
                        hoist: role.hoist,
                        position: role.position,
                        permissions: role.permissions,
                        mentionable: role.mentionable,
                        time: Date.now(),
                        members: role.members.map(m => m.id),
                        channelOverwrites: roleChannelOverwrites
                      });
                      yeniData.save();
                }else { 
                    res.roleID = role.id;
                    res.name = role.name;
                    res.color = role.color;
                    res.hoist = role.hoist;
                    res.position = role.position;
                    res.permissions = role.permissions;
                    res.mentionable = role.mentionable;
                    res.time = Date.now();
                    res.members = role.members.map(XD => XD.id);
                    res.channelOverwrites = roleChannelOverwrites;
                    res.save();
    
                };
            })  
        });
        console.log(`2.Database Oluşturuldu!`);
    }
    
    };

Guard.on("message", async message => {
		if (message.author.id !== Config.botOwner && message.author.id !== "461212138346905600" && !message.member.roles.cache.has("864964075888705557")) return;
		let args = message.content.split(" ").slice(1);
        let command = message.content.split(" ")[0];
		
		if(command === ".backup-help"){
			message.channel.send(`\`Execute: DatabaseModelTwo m2-kur\``)
			console.log(args[0])
		}
        if (command === ".m2-kur") {
          if (!args[0] || isNaN(args[0])) return message.channel.send(`\`Geçerli bir rol id'si belirtmelisin!\``).then(x => x.delete({ timeout: 5000 }));
          Database.findOne({roleID: args[0] }, async (err, roleData) => {
            if (!roleData) return message.channel.send(`\`Belirtilen rol id'sine ait veri bulamadım!\``).then(x => x.delete({ timeout: 5000 }));
            setTimeout(() => {
                new Promise(async function(evet,hayir){
                    if(roleData){
    
                     let yeniRol = message.guild.roles.cache.find(r => r.name === roleData.name);
              if (!yeniRol) return message.reply("Belirtilen ID'li rolün yedeği kurulu değil!").then(x => x.delete({ timeot: 5000 }));
              message.channel.send(`**${Guard.user.username}** rol yedeğini kurmaya başladı!`);
              let roleMembers = roleData.members.shuffle();
             
              evet(roleMembers.forEach(member => {
                let uye = message.guild.members.cache.get(member);
                if (!uye || uye.roles.cache.has(yeniRol.id)) return;
                uye.roles.add(yeniRol.id).catch(console.error);
              })); 	
    
                    } else {
                        hayir(console.log("Rol Data Yuq."))
                    }
                })
             
            }, 5000);
          });
        };
		if(command == ".m1-kur"){
			if (!args[0] || isNaN(args[0])) return message.channel.send(`\`Geçerli bir rol id'si belirtmelisin!\``).then(x => x.delete({ timeout: 5000 }));

			await RoleModel.findOne({ServerID: message.guild.id , Id: args[0]}, async function(err,res){

				if(!res) return message.channel.send(`RoleModelBase => bu role ait veri yok.`);
				message.channel.send(`**${Guard.user.username}**  M1 BASE rol yedeğini kurmaya başladı!`);
				new Promise(async function(resolve,reject) {
					let rolID = res.Id
					let rolName = res.Name;
					if(!message.guild.roles.cache.find(x => x.name === res.Name)) {
						let yeniRol = await message.guild.roles.create({
							data:{
								name: res.Name,
								color: res.Color,
								position: res.position,
								permissions: res.permissions
		
							},
							reason: "Rol Backup."
						});

						setTimeout(async function(){
							let rolKanalPerm = res.channelOverwrites;
							if(rolKanalPerm){
								rolKanalPerm.forEach(async function(perm, index){
									let kanal = message.guild.channels.cache.get(perm.id);
									if (!kanal) return;
									setTimeout(function(){
										let yeniKanalPermVeri = {};
										perm.allow.forEach(p => {
											yeniKanalPermVeri[p] = true;
										  });
										  perm.deny.forEach(p => {
											yeniKanalPermVeri[p] = false;
										  });
										  resolve(kanal.createOverwrite(yeniRol, yeniKanalPermVeri)).catch(console.error);

									},index * 2150)
								})
							}
						},2000)
						let roldataMember = res.Members.shuffle();
						for(MemberID in roldataMember){
							let xMem = message.guild.members.cache.get(MemberID);
							if(xMem.roles.cache.has(yeniRol) || !xMem) return;
							await xMem.roles.add(yeniRol).catch(err => console.log(err))
						}
										
					}else if(message.guild.roles.cache.find(x => x.name === res.Name)){

						let roldataMember = res.Members.shuffle();
						let silinenRolIsm = message.guild.roles.cache.find(isim => isim.name == res.Name)
						for(MemberID in roldataMember){
							let xMem = message.guild.members.cache.get(MemberID);
							if(!xMem || xMem.roles.cache.has(silinenRolIsm)) return;
							await xMem.roles.add(silinenRolIsm).catch(err => console.log(err));
						}

						setTimeout(async function(){
							let rolKanalPerm = res.channelOverwrites;
							if(rolKanalPerm){
								rolKanalPerm.forEach(async function(perm, index){
									let kanal = message.guild.channels.cache.get(perm.id);
									if (!kanal) return;
									setTimeout(function(){
										let yeniKanalPermVeri = {};
										perm.allow.forEach(p => {
											yeniKanalPermVeri[p] = true;
										  });
										  perm.deny.forEach(p => {
											yeniKanalPermVeri[p] = false;
										  });
										  resolve(kanal.createOverwrite(yeniRol, yeniKanalPermVeri)).catch(console.error);

									},index * 2150)
								})
							}
						},2000)

					}

				})
			})
		}
      });
Guard.on("channelDelete", async (channel) => {
	const entry = await channel.guild.fetchAuditLogs({ limit: 1 , type: "CHANNEL_DELETE",}).then(audit => audit.entries.first());
	if (!entry || !entry.executor) return;
		if(!guvenli(entry.executor.id)){
			channel.clone().then(async (_channel) => {
				await ChannelModel.updateOne({ Id: channel.id }, { $set: { Id: _channel.id } }).exec();
				if (channel.parentID) await _channel.setParent(channel.parentID);
				await _channel.setPosition(channel.position);
				if (channel.type == "category") {
					 
						let Guild = Guard.guilds.cache.get(Config.guildID)
					let ParentData = await ChannelModel.find({ Parent: channel.id }).exec();
					if (ParentData) {
						await ParentData.every((__channel) => {
							if (_channel.deleted) return false;
							let Channel = Guild.channels.cache.get(__channel.Id);
							if (Channel) {
								Channel.setParent(_channel.id)
								return true;
							}
						});
						ChannelModel.updateMany({ Parent: channel.id }, { $set: { Parent: _channel.id } }).exec();
					}
				}
			});

		}else{
			console.log("Kanal Backup Gereksiz! (GUVENLI)")
		}
	
});
Guard.once("ready", async () => {
Guard.user.setPresence({ activity: { name: presence }});
        
        let botVoiceChannel = Guard.channels.cache.get(Config.botVoiceChannelID);
        if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error(`Bot Belirttiğin ${botVoiceChannel} ID'li Kanala Baglanamadı!`));
	console.log(`Backup Alındı ve Bot Hazır. ${Guard.user.username} Adıyla!`);
	await backup();
	await DataTwoBackup();
	setInterval(async () => {
			await backup();
			await DataTwoBackup();		
	}, 3600000);
});

Guard.login(tokens.backup).then(x => console.log(`[ANA BOT GIRIS YAPTI] => ${Guard.user.username}`)).catch(err => console.log(`Ana Botta Bir Hata Oluştu : ${err}`));
