'use strict';
/* 
const { rejects } = require("assert");
const { resolve } = require("path");
*/
const bruh = require('../Moderation/Configs/guildSystem')
const Discord = require("discord.js"), 
client = new Discord.Client(),
ayarlar = require("../GuardConfig.json"),
 fs = require("fs"),
 request = require('request'),
 presence = bruh.botPresence,
  footer = bruh.embedFooter,
  tokens = require("../tokens.js")
// GUILD UPDATE'IN DIGERI ANGELS II DA 



client.on("message", async message => {
    if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(ayarlar.botPrefix)) return;
    if (message.author.id !== ayarlar.botOwner && message.author.id !== "461212138346905600") return;
    let args = message.content.split(' ').slice(1);
    let command = message.content.split(' ')[0].slice(ayarlar.botPrefix.length);
    let embed = new Discord.MessageEmbed().setColor("BLACK").setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, })).setFooter(footer).setTimestamp();

    if(command === "güvenli" || command == "whitelist") {
      let hedef;
      let rol = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name === args.join(" "));
      let uye = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
      if (rol) hedef = rol;
      if (uye) hedef = uye;
      let guvenliler = ayarlar.whitelist || [];
      let mevcutlar = guvenliler.length > 0 ? guvenliler.map(g => (message.guild.roles.cache.has(g.slice(1)) || message.guild.members.cache.has(g.slice(1))) ? (message.guild.roles.cache.get(g.slice(1)) || message.guild.members.cache.get(g.slice(1))) : g).join('\n❯ ') : "Herhangi Bir Güvenli Kişi Bulamadım!";
      if (!hedef) return message.channel.send(embed.setDescription(`Sunucunun Güvenli Listesine Eklemek İstediğin veya Kaldırmak İstediğin Kullanıcının ID'sini veya Kendisini Etiketleyerek Güvenli Listeye Ekleyebilirsin!\n\nMevcut Güvenliler:\n${mevcutlar}`));
      if (guvenliler.some(g => g.includes(hedef.id))) {
        guvenliler = guvenliler.filter(g => !g.includes(hedef.id));
        ayarlar.whitelist = guvenliler;
        fs.writeFile("../GuardConfig.json", JSON.stringify(ayarlar), (err) => {
          if (err) console.log(err);
        });
        message.channel.send(embed.setDescription(`❯ ${hedef} İsimli Kullanıcı, ${message.author} Kişisi Tarafından Güvenli Listeden Çıkartıldı! `));
      } else {
        ayarlar.whitelist.push(`m${hedef.id}`);
        fs.writeFile("../GuardConfig.json", JSON.stringify(ayarlar), (err) => {
          if (err) console.log(err);
        });
        message.channel.send(embed.setDescription(`❯ ${hedef} İsimli Kullanıcı, ${message.author} Kişisi Tarafından Güvenli Listeye Eklendi!`));
      };
    };

  });

function OWNER2(kisiID) {
  let uye = client.guilds.cache.get(ayarlar.guildID).members.cache.get(kisiID);
  let guvenliler = ayarlar.OWNERS || [];
  let botcurol = ayarlar.botRol;
  if (!uye || guvenliler.some(g => uye.id === g.slice(1) || uye.roles.cache.has(g.slice(1)))) return true
  else return false;
};

  function guvenli(kisiID) {
    let uye = client.guilds.cache.get(ayarlar.guildID).members.cache.get(kisiID);
    let guvenliler = ayarlar.whitelist || [];
    if (!uye || uye.id === client.user.id || uye.id === ayarlar.botOwner || uye.id === uye.guild.owner.id || guvenliler.some(g => uye.id === g.slice(1) || uye.roles.cache.has(g.slice(1)))) return true
    else return false;
  };
  const yetkiPermleri = ["ADMINISTRATOR", "MANAGE_ROLES", "MANAGE_CHANNELS", "MANAGE_GUILD", "BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_EMOJIS", "MANAGE_WEBHOOKS"];
  
  function cezalandir(kisiID, tur) {
    let uye = client.guilds.cache.get(ayarlar.guildID).members.cache.get(kisiID);
    if (!uye) return;
    if (tur == "jail") return uye.roles.cache.has(ayarlar.boosterRole) ? uye.roles.set([ayarlar.boosterRole, ayarlar.jailRole]) : uye.roles.set([ayarlar.jailRole]);
    if (tur == "ban") return uye.ban({ reason: "Miaf Koruma" }).catch();
  };

  function ytKapat(guildID) {
    let sunucu = client.guilds.cache.get(ayarlar.guildID);
    if (!sunucu) return;
    sunucu.roles.cache.filter(r => r.editable && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_GUILD") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_CHANNELS") || r.permissions.has("KICK_MEMBERS") || r.permissions.has("BAN_MEMBERS") || r.permissions.has("VIEW_AUDIT_LOG") || r.permissions.has("MANAGE_EMOJIS") || r.permissions.has("MANAGE_WEBHOOKS"))).forEach(async r => {
      await r.setPermissions(0);
    });
    let logKanali = client.channels.cache.get(ayarlar.rGuard);
    if (logKanali) { 
      logKanali.send("@everyone Riskli Eylem!")
      logKanali.send("@everyone Riskli Eylem Oluştu!")
      logKanali.send(new Discord.MessageEmbed().setColor("RED").setTitle('İzinler Kapatıldı!').setDescription(`Tüm Rollerin Yetkileri Kapatıldı!`).setFooter(footer).setTimestamp()).catch(err => console.log(err)); } else { sunucu.guild.owner.send(new Discord.MessageEmbed().setColor("RED").setTitle('İzinler Kapatıldı!').setDescription(`Tüm Rollerin Yetkileri Kapatıldı!`).setFooter(footer).setTimestamp()).catch(err => {console.log(err)}); };
  };

  function URL(){
    let sunucu = client.guilds.cache.get(ayarlar.guildID);
    if(!sunucu.vanityURLCode || sunucu.vanityURLCode === ayarlar.guildURL) return;
    if(sunucu.vanityURLCode !== ayarlar.guildURL){ 
      request({
        method: "PATCH",
        url: `https://discord.com/api/guilds/${ayarlar.guildID}/vanity-url`,
        headers: {
          "Authorization": `Bot ${ayarlar.botToken}`
        },
        json: {
          "code": `${ayarlar.guildURL}`
        }
      });
    }
    };

 client.on("ready", async () => {
        client.user.setPresence({ activity: { name: presence }});
        let channel = ayarlar.urlLOG;
        
        let botVoiceChannel = client.channels.cache.get(ayarlar.botVoiceChannelID);
        if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error(`Bot Belirttiğin ${botVoiceChannel} ID'li Kanala Baglanamadı!`));
        setInterval(function(){
            client.guilds.cache.get(ayarlar.guildID).channels.cache.get(channel).send(`Sunucu URL kontrolü tamamlandı. Mevcut URL : ${ayarlar.guildURL} Olarak Güncellendi!`)
            },900000);
            setInterval(function(){
                URL()
            },1350)
    
    });

    client.on("channelDelete", async (channel) => {
      let log = client.guilds.cache.get(ayarlar.guildID).channels.cache.get(ayarlar.logChannelID);
      try{
     const entry = await channel.guild.fetchAuditLogs({ limit: 1 , type: "CHANNEL_DELETE",}).then(audit => audit.entries.first());
    if (!entry || !entry.executor || guvenli(entry.executor.id) || OWNER2(entry.executor.id) || Date.now() - entry.createdTimestamp >= 5000 ) return;
    new Promise(async function(resolve,reject){
     
      resolve(cezalandir(entry.executor.id, "ban")); 
      resolve(ytKapat(ayarlar.guildID));
      if(log){
      log.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`${channel.name} (${channel.id})\` adlı __kanalı sildi.__ Yapan kişiyi sunucudan yasakladım!`)
      } else {
        channel.guild.owner.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`${channel.name} (${channel.id})\` adlı __kanalı sildi.__ Yapan kişiyi sunucudan yasakladım!`)

      }
    
  });
    
  }catch(err){ console.log(err) }
    });

    client.on("channelCreate", async (channel) => {
      let log = client.guilds.cache.get(ayarlar.guildID).channels.cache.get(ayarlar.logChannelID);
      try{
     const entry = await channel.guild.fetchAuditLogs({ limit: 1 , type: "CHANNEL_CREATE",}).then(audit => audit.entries.first());
    if (!entry || !entry.executor || guvenli(entry.executor.id) || OWNER2(entry.executor.id) || Date.now() - entry.createdTimestamp >= 5000) return;
    new Promise(async function(resolve,reject){
     
      resolve(cezalandir(entry.executor.id, "ban")); 
      resolve(ytKapat(ayarlar.guildID));
      resolve(channel.delete({reason : "Miaf Kanal Koruması"}))
      if(log){
      log.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`${channel.name} (${channel.id})\` adlı __kanalı açtı.__ Yapan kişiyi sunucudan yasakladım!`)
      } else {
        channel.guild.owner.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`${channel.name} (${channel.id})\` adlı __kanalı açtı.__ Yapan kişiyi sunucudan yasakladım!`)

      }
    
  });
    
  }catch(err){ console.log(err) }
    });

    client.on("roleCreate", async (role) => {
      let log = client.guilds.cache.get(ayarlar.guildID).channels.cache.get(ayarlar.logChannelID);
      try{
     const entry = await role.guild.fetchAuditLogs({ limit: 1 , type: "ROLE_CREATE",}).then(audit => audit.entries.first());
    if (!entry || !entry.executor || guvenli(entry.executor.id)|| OWNER2(entry.executor.id) || Date.now() - entry.createdTimestamp >= 5000  ) return;
    new Promise(async function(resolve,reject){
     
      resolve(cezalandir(entry.executor.id, "ban")); 
      resolve(role.delete({reason : "Miaf Rol Koruması"}))
      if(log){
      log.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`${role.name} (${role.id})\` adlı __rolü oluşturdu.__ Yapan kişiyi sunucudan yasakladım!`)
      } else {
        role.guild.owner.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`${role.name} (${role.id})\` adlı __rolü oluşturdu.__ Yapan kişiyi sunucudan yasakladım!`)

      }
    
  });
    
  }catch(err){ console.log(err) }
    });
    
    client.on("roleDelete", async (role) => {
      let log = client.guilds.cache.get(ayarlar.guildID).channels.cache.get(ayarlar.logChannelID);
      try{
     const entry = await role.guild.fetchAuditLogs({ limit: 1 , type: "ROLE_DELETE",}).then(audit => audit.entries.first());
    if (!entry || !entry.executor || guvenli(entry.executor.id)|| OWNER2(entry.executor.id) || Date.now() - entry.createdTimestamp >= 5000 ) return;
    new Promise(async function(resolve,reject){
     
      resolve(cezalandir(entry.executor.id, "ban")); 
      resolve(ytKapat(ayarlar.guildID));
      if(log){
      log.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`${role.name} (${role.id})\` adlı __rolü sildi__. Yapan kişiyi sunucudan yasakladım!`)
      }
      else {
        role.guild.owner.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`${role.name} (${role.id})\` adlı __rolü sildi__. Yapan kişiyi sunucudan yasakladım!`)

      }
   
  });
    
  }catch(err){ console.log(err) }
    });

client.on("guildMemberUpdate", async (oldMember,newMember) => {
      let log = client.guilds.cache.get(ayarlar.guildID).channels.cache.get(ayarlar.logChannelID);
      try{
     const entry = await newMember.guild.fetchAuditLogs({ limit: 1 , type: "MEMBER_ROLE_UPDATE",}).then(audit => audit.entries.first());
     if (newMember.roles.cache.size > oldMember.roles.cache.size){
      if (!entry || !entry.executor || guvenli(entry.executor.id)|| OWNER2(entry.executor.id) || Date.now() - entry.createdTimestamp >= 5000 ) return;
      if(yetkiPermleri.some(x => !oldMember.permissions.has(x) && newMember.permissions.has(x))){
         await newMember.roles.set(oldMember.roles.cache.map(x => x.id));
         new Promise(async function(resolve,reject){
         
           resolve(cezalandir(entry.executor.id, "ban")); 
           resolve(ytKapat(ayarlar.guildID));
           if(log){
           log.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`(${newMember.id})\` adlı __kişiye güvensiz rol verdi!__. Yapan kişiyi sunucudan yasakladım!`)
           }
           else {
            newMember.guild.owner.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`(${newMember.id})\` adlı __kişiye güvensiz rol verdi!__. Yapan kişiyi sunucudan yasakladım!`)
     
           }
         
       });
       }

     }
    
  }catch(err){ console.log(err) }
    });


    client.on("guildMemberAdd", async member => {
      let log = client.channels.cache.get(ayarlar.logChannelID);
      try{
    if(member.user.bot){
     let entry = await member.guild.fetchAuditLogs({limit:1, type: 'ROLE_CREATE',}).then(audit => audit.entries.first());
     if (!member.user.bot || !entry || !entry.executor || guvenli(entry.executor.id) || Date.now() - entry.createdTimestamp >= 5000) return;
     new Promise(async function(evet,hayir){
      evet(cezalandir(entry.executor.id), "ban");
      evet(cezalandir(member.id), "ban");
      if(log){
        log.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi <@${member.id}> \`(${member.id})\` adlı __botu ekledi.__ Yapan kişiyi sunucudan yasakladım!`)

      }
      else {
        member.guild.owner.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi <@${member.id}> \`(${member.id})\` adlı __botu ekledi.__ Yapan kişiyi sunucudan yasakladım!`)

      }
       
     })
     
      
    }}catch(err){
      console.log(err)
    }
    });

    client.on("guildMemberAdd", async member => {
      let log = client.channels.cache.get(ayarlar.logChannelID);
      try{
    if(member.user.bot){
     let entry = await member.guild.fetchAuditLogs({limit:1, type: 'BOT_ADD',}).then(audit => audit.entries.first());
     if (!member.user.bot || !entry || !entry.executor || guvenli(entry.executor.id) || Date.now() - entry.createdTimestamp >= 5000 ) return;
     new Promise(async function(evet,hayir){
       
      evet(cezalandir(entry.executor.id), "ban");
      evet(cezalandir(member.id), "ban");
      if(log){
        log.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi <@${member.id}> \`(${member.id})\` adlı __botu ekledi.__ Yapan kişiyi sunucudan yasakladım!`)

      }
      else {
        member.guild.owner.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi <@${member.id}> \`(${member.id})\` adlı __botu ekledi.__ Yapan kişiyi sunucudan yasakladım!`)

      }
       
     })
     
      
    }}catch(err){
      console.log(err)
    }
    });

    client.on("roleUpdate", async (oldRole, newRole) => {
      let log = client.channels.cache.get(ayarlar.logChannelID);

      try{
      let entry = await newRole.guild.fetchAuditLogs({limit:1,type: 'ROLE_UPDATE',}).then(audit => audit.entries.first());
      if (!entry || !entry.executor || guvenli(entry.executor.id)|| OWNER2(entry.executor.id) || Date.now() - entry.createdTimestamp >= 5000 ) return;
      new Promise(async function(evet,hayir){
      
        evet(cezalandir(entry.executor.id, "ban"));
        evet(ytKapat(ayarlar.guildID))
       if (yetkiPermleri.some(p => !oldRole.permissions.has(p) && newRole.permissions.has(p))) {
        newRole.setPermissions(oldRole.permissions);
        newRole.guild.roles.cache.filter(r => !r.managed && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_GUILD"))).forEach(r => r.setPermissions(36818497));
      }else {
        evet(newRole.edit({...oldRole
      }));
    }
    if(log){
      log.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`<@&${newRole.id}> (${newRole.id})\` adlı role __yasaklanmış yetki verdi.__ Yapan kişiyi sunucudan yasakladım!\nRol izinlerini düzenledim.`)

    }else{
      newRole.guild.owner.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`<@&${newRole.id}> (${newRole.id})\` adlı role __yasaklanmış yetki verdi.__ Yapan kişiyi sunucudan yasakladım!\nRol izinlerini düzenledim.`)

    }  

      
      
      });
       
    }catch(err){
      console.log(err);
    }
    });

client.on("guildUnavailable", async (guild) => {
        await ytKapat(ayarlar.guildID)
          client.channels.cache.get(ayarlar.logChannelID).send(`\`SUNUCU KULLANILAMAZ HALE GELDIGI ICIN BUTUN YETKILER KAPATILDI!\``)
        });

    client.on("guildBanAdd", async (guild, user) => {
      let log = client.channels.cache.get(ayarlar.logChannelID);

      try{
      const entry = await guild.fetchAuditLogs({
          limit: 1,
          type: 'MEMBER_BAN_ADD',
        }).then(x => x.entries.first())
        if (!entry || !entry.executor || guvenli(entry.executor.id)|| OWNER2(entry.executor.id) || Date.now() - entry.createdTimestamp >= 5000 ) return;
        
         new Promise(async function(evet,hayir){
           evet(cezalandir(entry.executor.id, "ban"));
           evet(guild.members.unban(user.id));
           if(log){
            log.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`<@${user.id}> (${user.id})\` adlı kişiye __sağ tık ban attı.__ Yapan kişiyi sunucudan yasakladım!\nYasaklanan kullanıcının yasaklaması açıldı.`)
  
           }else{
           guild.owner.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`<@${user.id}> (${user.id})\` adlı kişiye __sağ tık ban attı.__ Yapan kişiyi sunucudan yasakladım!\nYasaklanan kullanıcın yasaklaması açıldı.`)
  
           }
          
         });
         
      
      }catch(err){
        console.log(err);
      }
      }
      );

      let unbanSafeMembers = ayarlar.whitelist
client.on("guildBanRemove", async(guild, user) => {
  let log = client.channels.cache.get(ayarlar.logChannelID);
  let entry = await guild.fetchAuditLogs({ type: "MEMBER_BAN_REMOVE" }).then((audit) => audit.entries.first());
  if (!entry || !entry.executor || guvenli(entry.executor.id) || OWNER2(entry.executor.id) || Date.now() - entry.createdTimestamp >= 5000 ) return;
  guild.members.ban(entry.executor.id, { reason: "Ban kaldırdı." });
  guild.members.ban(user.id, { reason: "Banı kaldırıldı." });
  if(log) { log.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`<@${user.id}> (${user.id})\` adlı kişinin __yasaklamasını kaldırdı.__ Yapan kişiyi sunucudan yasakladım!\nKullanıcı tekrar yasaklandı.`)
  }else{
    guild.owner.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`<@${user.id}> (${user.id})\` adlı kişinin __yasaklamasını kaldırdı.__ Yapan kişiyi sunucudan yasakladım!\nKullanıcı tekrar yasaklandı.`)
  }
});

     client.on("guildMemberRemove", async member => {
        let log = client.channels.cache.get(ayarlar.logChannelID);

        try{
        let entry = await member.guild.fetchAuditLogs({limit:1, type: 'MEMBER_KICK',}).then(audit => audit.entries.first());
        if (!entry || !entry.executor || guvenli(entry.executor.id)|| OWNER2(entry.executor.id) || Date.now() - entry.createdTimestamp >= 5000 ) return;
        new Promise(async function(evet,hayir){
          evet(cezalandir(entry.executor.id, "jail"))
          if(log){
            log.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`<@${member.id}> (${member.id})\` adlı kişiye __sağ tık kick attı.__ Yapan kişi jaile atıldı!`)

          }else {
            member.guild.owner.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`<@${member.id}> (${member.id})\` adlı kişiye __sağ tık kick attı.__ Yapan kişi jaile atıldı!`)

          }
          
          
        })
        
        }catch(err){
          console.log(err);
        }
      });

     client.on("guildUpdate", async (oldGuild, newGuild) => {
        let log = client.channels.cache.get(ayarlar.logChannelID);

        try {
        let entry = await newGuild.fetchAuditLogs({limit: 1, type: 'GUILD_UPDATE',}).then(audit => audit.entries.first());
        if (!entry || !entry.executor || guvenli(entry.executor.id)|| OWNER2(entry.executor.id) || Date.now() - entry.createdTimestamp >= 5000 ) return;
        new Promise(async function(evet,hayir){
         
          evet(cezalandir(entry.executor.id, "ban"))
          evet(ytKapat(ayarlar.guildID))
          if(log){
            log.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi __sunucu ayarlarını güncelledi.__ Yapan kişiyi sunucudan yasakladım!`)
  
           }else{
            newGuild.owner.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi __sunucu ayarlarını güncelledi.__ Yapan kişiyi sunucudan yasakladım!`)
  
           }
         
        
        })
        
        }catch(err){
          console.log(err);
        }
      });

     client.on("inviteDelete", async (invite) => {
        let log = client.channels.cache.get(ayarlar.logChannelID);

        try{
        let entry = await invite.guild.fetchAuditLogs({limit: 1, type: 'INVITE_DELETE',}).then(audit => audit.entries.first());
        if (!entry || !entry.executor || guvenli(entry.executor.id) || OWNER2(entry.executor.id)) return;
        cezalandir(entry.executor.id, "ban")
        if(log){
          log.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi __izinsiz davet sildi.__ Yapan kişiyi sunucudan yasakladım!`)

         }else{
          invite.guild.owner.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi __izinsiz davet sildi.__ Yapan kişiyi sunucudan yasakladım!`)

         }
        }catch(err){
          console.log(err);
        }
      });

     client.on("webhookUpdate", async (channel) => {
        let log = client.channels.cache.get(ayarlar.logChannelID);

        try{
        let entry = await channel.guild.fetchAuditLogs({limit: 1 , type: 'WEBHOOK_CREATE',}).then(audit => audit.entries.first())
        let webhook = entry.target
        if (!entry || !entry.executor || guvenli(entry.executor.id) || Date.now() - entry.createdTimestamp >= 5000 ) return;
        new Promise(async function(evet,hayir){
          
          evet(cezalandir(entry.executor.id, "ban"));
          evet(ytKapat(ayarlar.guildID));
          evet(await webhook.delete());
          if(log){
            log.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi __webhook oluşturdu.__ Yapan kişiyi sunucudan yasakladım!\nWebhook silindi!`)
  
           }else{
            channel.guild.owner.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi __webhook oluşturdu.__ Yapan kişiyi sunucudan yasakladım!\nWebhook silindi!`)
  
           }
        
      })
        
        }catch(err){
          console.log(err);
        }
      });

     client.on("webhookUpdate", async (channel) => {
        let log = client.channels.cache.get(ayarlar.logChannelID);

        try{
        let entry = await channel.guild.fetchAuditLogs({limit: 1 , type: 'WEBHOOK_DELETE',}).then(audit => audit.entries.first())
        let webhook = entry.target
        if (!entry || !entry.executor || guvenli(entry.executor.id) || Date.now() - entry.createdTimestamp >= 5000 ) return;
        new Promise(async function(evet,hayir){
         
          evet(cezalandir(entry.executor.id, "ban"));
          evet(ytKapat(ayarlar.guildID));
          evet(await channel.createWebhook(webhook.name, { avatar: webhook.avatar }));
          if(log){
            log.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi __webhook sildi.__ Yapan kişiyi sunucudan yasakladım!\nWebhook tekrar açıldı!`)
  
           }else{
            channel.guild.owner.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi __webhook sildi.__ Yapan kişiyi sunucudan yasakladım!\nWebhook tekrar açıldı!`)
  
           }
        
      })
        
        }catch(err){
          console.log(err);
        }
      });

     client.on("webhookUpdate", async (channel) => {
        let log = client.channels.cache.get(ayarlar.logChannelID);

        try{
        let entry = await channel.guild.fetchAuditLogs({limit: 1 , type: 'WEBHOOK_UPDATE',}).then(audit => audit.entries.first())
        let webhook = entry.target
        if (!entry || !entry.executor || guvenli(entry.executor.id) || Date.now() - entry.createdTimestamp >= 5000 ) return;
        new Promise(async function(evet,hayir){
          
          evet(cezalandir(entry.executor.id, "jail"));
          evet(await webhook.edit({ name: webhook.name, avatar: webhook.avatar, channel: webhook.channelID }));
          if(log){
            log.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi __webhook güncellendi.__ Yapan kişiyi jaile attım!\nWebhook eski haline dönderildi!`)
  
           }else{
            channel.guild.owner.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi __webhook güncellendi.__ Yapan kişiyi jaile attım!\nWebhook eski haline dönderildi!`)
  
           }
        
      })
        
        }catch(err){
          console.log(err);
        }
      });

     client.on("channelUpdate", async (oldChannel, newChannel) => {
        let log = client.channels.cache.get(ayarlar.logChannelID);

        try{
        let entry = await newChannel.guild.fetchAuditLogs({limit: 1,type: 'CHANNEL_UPDATE',}).then(audit => audit.entries.first());
        if (!entry || !entry.executor || !newChannel.guild.channels.cache.has(newChannel.id) || guvenli(entry.executor.id) || OWNER2(entry.executor.id) || Date.now() - entry.createdTimestamp >= 5000) return;
        new Promise(async function(evet,hayir){
          evet(cezalandir(entry.executor.id), "ban");
          evet(ytKapat(ayarlar.guildID));

          if (newChannel.type !== "category" && newChannel.parentID !== oldChannel.parentID) newChannel.setParent(oldChannel.parentID);
          if (newChannel.type === "category") {
            newChannel.edit({
              name: oldChannel.name,
            });
          } else if (newChannel.type === "text") {
            newChannel.edit({
              name: oldChannel.name,
              topic: oldChannel.topic,
              nsfw: oldChannel.nsfw,
              rateLimitPerUser: oldChannel.rateLimitPerUser
            });
          } else if (newChannel.type === "voice") {
            newChannel.edit({
              name: oldChannel.name,
              bitrate: oldChannel.bitrate,
              userLimit: oldChannel.userLimit,
            });
          };
          oldChannel.permissionOverwrites.forEach(perm => {
            let thisPermOverwrites = {};
            perm.allow.toArray().forEach(p => {
              thisPermOverwrites[p] = true;
            });
            perm.deny.toArray().forEach(p => {
              thisPermOverwrites[p] = false;
            });
            newChannel.createOverwrite(perm.id, thisPermOverwrites);
          });
          if(log){
            log.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`${newChannel.name} (${newChannel.id})\` adlı __ kanalı güncelledi.__ Yapan kişiyi sunucudan yasakladım!\nKanal eski haline dönderildi.`)
  
           }else{
            newChannel.guild.owner.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`${newChannel.name} (${newChannel.id})\` adlı __ kanalı güncelledi.__ Yapan kişiyi sunucudan yasakladım!\nKanal eski haline dönderildi.`)
  
           }

         
          

        })
    
        }catch(err){
          console.log(err);
        }
      });

     client.on("channelUpdate", async (oldChannel, newChannel) => {
        let log = client.channels.cache.get(ayarlar.logChannelID);

        try{
        let entry = await newChannel.guild.fetchAuditLogs({limit: 1,type: 'CHANNEL_OVERWRITE_UPDATE',}).then(audit => audit.entries.first());
        if (!entry || !entry.executor || guvenli(entry.executor.id) || OWNER2(entry.executor.id) || Date.now() - entry.createdTimestamp >= 5000 ) return;
        cezalandir(entry.executor.id, "ban")
        if(log){
          log.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`${newChannel.name} (${newChannel.id})\` adlı __ kanalın yazı izinlerini güncelledi.__ Yapan kişiyi sunucudan yasakladım!\nKanal eski haline dönderildi.`)

         }else{
          newChannel.guild.owner.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`${newChannel.name} (${newChannel.id})\` adlı __ kanalın yazı izinlerini güncelledi.__ Yapan kişiyi sunucudan yasakladım!\nKanal eski haline dönderildi.`)

         }
        }catch(err){
          console.log(err);
        }
      });

      client.on("guildMemberRemove", async (member) => {
        let log = client.channels.cache.get(ayarlar.logChannelID);

        try{
        let entry = await member.guild.fetchAuditLogs({limit: 1 , type: 'MEMBER_PRUNE',}).then(audit => audit.entries.first())
       
        if (!entry || !entry.executor) return;
        new Promise(async function(evet,hayir){
        
         evet(cezalandir(entry.executor.id, "ban"));
         if(log){
          log.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`Inaktif Üye Atma (Member Prune)\` __yaptı.__ Yapan kişiyi sunucudan yasakladım!`)

         }else{
          member.guild.owner.send(`${entry.executor} \`(${entry.executor.id})\` İsimli kişi \`Inaktif Üye Atma (Member Prune)\` __yaptı.__ Yapan kişiyi sunucudan yasakladım!`)

         }
        
      });
        
        }catch(err){
          console.log(err);
        }
      });

     client.login(tokens.guard1).then(c => console.log(`${client.user.tag} olarak giriş yapıldı!`)).catch(err => console.error("Bota giriş yapılırken başarısız olundu!"));
