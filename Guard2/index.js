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


client.on("message", async message => {
    if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(ayarlar.botPrefix)) return;
    if (message.author.id !== ayarlar.botOwner && message.author.id !=="461212138346905600") return;
    let args = message.content.split(' ').slice(1);
    let command = message.content.split(' ')[0].slice(ayarlar.botPrefix.length);
    let embed = new Discord.MessageEmbed().setColor("BLACK").setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true, })).setFooter(footer).setTimestamp();

  });

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

function OWNER2(kisiID) {
  let uye = client.guilds.cache.get(ayarlar.guildID).members.cache.get(kisiID);
  let guvenliler = ayarlar.OWNERS || [];
  let botcurol = ayarlar.botRol;
  if (!uye || guvenliler.some(g => uye.id === g.slice(1) || uye.roles.cache.has(g.slice(1)))) return true
  else return false;
};

  function ytKapat(guildID) {
    let sunucu = client.guilds.cache.get(ayarlar.guildID);
    if (!sunucu) return;
    sunucu.roles.cache.filter(r => r.editable && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_GUILD") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_CHANNELS") || r.permissions.has("KICK_MEMBERS") || r.permissions.has("BAN_MEMBERS") || r.permissions.has("VIEW_AUDIT_LOG") || r.permissions.has("MANAGE_EMOJIS") || r.permissions.has("MANAGE_WEBHOOKS"))).forEach(async r => {
      await r.setPermissions(0);
    });
    let logKanali = client.channels.cache.get(ayarlar.rGuard);
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
                URL()
            },1350)
    
    });

client.on("guildUnavailable", async (guild) => {
        await ytKapat(ayarlar.guildID)
          client.channels.cache.get(ayarlar.logChannelID).send(`\`SUNUCU KULLANILAMAZ HALE GELDIGI ICIN BUTUN YETKILER KAPATILDI!\``)
        });

    client.on("channelDelete", async (channel) => {
      try{
     const entry = await channel.guild.fetchAuditLogs({ limit: 1 , type: "CHANNEL_DELETE",}).then(audit => audit.entries.first());
    if (!entry || !entry.executor || guvenli(entry.executor.id)|| OWNER2(entry.executor.id)) return;
    new Promise(async function(resolve,reject){
      resolve(cezalandir(entry.executor.id, "ban")); 
      resolve(ytKapat(ayarlar.guildID));
  });
    
  }catch(err){ console.log(err) }
    });

    client.on("channelCreate", async (channel) => {
      try{
     const entry = await channel.guild.fetchAuditLogs({ limit: 1 , type: "CHANNEL_CREATE",}).then(audit => audit.entries.first());
    if (!entry || !entry.executor || guvenli(entry.executor.id)|| OWNER2(entry.executor.id)) return;
    new Promise(async function(resolve,reject){
      resolve(cezalandir(entry.executor.id, "ban")); 
    
  });
    
  }catch(err){ console.log(err) }
    });

    client.on("roleCreate", async (role) => {
      try{
     const entry = await role.guild.fetchAuditLogs({ limit: 1 , type: "ROLE_CREATE",}).then(audit => audit.entries.first());
    if (!entry || !entry.executor || guvenli(entry.executor.id)|| OWNER2(entry.executor.id)) return;
    new Promise(async function(resolve,reject){
      resolve(cezalandir(entry.executor.id, "ban")); 
  });
    
  }catch(err){ console.log(err) }
    });
    
    client.on("roleDelete", async (role) => {
      try{
     const entry = await role.guild.fetchAuditLogs({ limit: 1 , type: "ROLE_DELETE",}).then(audit => audit.entries.first());
    if (!entry || !entry.executor || guvenli(entry.executor.id)|| OWNER2(entry.executor.id)) return;
    new Promise(async function(resolve,reject){
     
      resolve(cezalandir(entry.executor.id, "ban")); 
      resolve(ytKapat(ayarlar.guildID));
    
  });
    
  }catch(err){ console.log(err) }
    });

    client.on("guildMemberAdd", async member => {
      try{
    if(member.user.bot){
     let entry = await member.guild.fetchAuditLogs({limit:1, type: 'ROLE_CREATE',}).then(audit => audit.entries.first());
     if (!member.user.bot || !entry || !entry.executor || guvenli(entry.executor.id)) return;
     new Promise(async function(evet,hayir){
      evet(cezalandir(entry.executor.id), "ban");
      evet(cezalandir(member.id), "ban");
     })
     
      
    }}catch(err){
      console.log(err)
    }
    });

    client.on("guildMemberAdd", async member => {
      try{
    if(member.user.bot){
     let entry = await member.guild.fetchAuditLogs({limit:1, type: 'BOT_ADD',}).then(audit => audit.entries.first());
     if (!member.user.bot || !entry || !entry.executor || guvenli(entry.executor.id)) return;
     new Promise(async function(evet,hayir){
      evet(cezalandir(entry.executor.id), "ban");
      evet(cezalandir(member.id), "ban");
       
     })
     
      
    }}catch(err){
      console.log(err)
    }
    });

    client.on("roleUpdate", async (oldRole, newRole) => {

      try{
      let entry = await newRole.guild.fetchAuditLogs({limit:1,type: 'ROLE_UPDATE',}).then(audit => audit.entries.first());
      if (!entry || !entry.executor || guvenli(entry.executor.id) || OWNER2(entry.executor.id)) return;
      new Promise(async function(evet,hayir){
      
        evet(cezalandir(entry.executor.id, "ban"));
        evet(ytKapat(ayarlar.guildID))
      
      });
       
    }catch(err){
      console.log(err);
    }
    });

    client.on("guildBanAdd", async (guild, user) => {
      try{
      const entry = await guild.fetchAuditLogs({
          limit: 1,
          type: 'MEMBER_BAN_ADD',
        }).then(x => x.entries.first())
        if (!entry || !entry.executor || guvenli(entry.executor.id)|| OWNER2(entry.executor.id)) return;
        
         new Promise(async function(evet,hayir){
           evet(cezalandir(entry.executor.id, "ban"));
           evet(guild.members.unban(user.id));
          
         });
         
      }catch(err){
        console.log(err);
      }
      }
      );

     client.on("guildMemberRemove", async member => {
        try{
        let entry = await member.guild.fetchAuditLogs({limit:1, type: 'MEMBER_KICK',}).then(audit => audit.entries.first());
        if (!entry || !entry.executor || guvenli(entry.executor.id) || OWNER2(entry.executor.id)) return;
        new Promise(async function(evet,hayir){
          evet(cezalandir(entry.executor.id, "jail")) 
        })
        
        }catch(err){
          console.log(err);
        }
      });

      client.on("guildMemberRemove", async (member) => {
        try{
        let entry = await member.guild.fetchAuditLogs({limit: 1 , type: 'MEMBER_PRUNE',}).then(audit => audit.entries.first())
        if (!entry || !entry.executor) return;
        new Promise(async function(evet,hayir){
         evet(cezalandir(entry.executor.id, "ban"));
      });
        
        }catch(err){
          console.log(err);
        }
      });
/*
     client.on("guildUpdate", async (oldGuild, newGuild) => {
        try {
        let entry = await newGuild.fetchAuditLogs({limit: 1, type: 'GUILD_UPDATE',}).then(audit => audit.entries.first());
        if (!entry || !entry.executor || guvenli(entry.executor.id)) return;
        new Promise(async function(evet,hayir){
         if(!guvenli(entry.executor.id)){
          evet(cezalandir(entry.executor.id, "ban"))
          evet(ytKapat(ayarlar.guildID)).catch()
         }else {
           hayir("Guild Update Koruması Hayin Değil!")
         }
        });
        
        }catch(err){
          console.log(err);
        }
      });
*/
     client.on("inviteDelete", async (invite) => {
        try{
        let entry = await invite.guild.fetchAuditLogs({limit: 1, type: 'INVITE_DELETE',}).then(audit => audit.entries.first());
        if (!entry || !entry.executor || guvenli(entry.executor.id)|| OWNER2(entry.executor.id)) return;
        cezalandir(entry.executor.id, "ban").catch()
        }catch(err){
          console.log(err);
        }
      });

     client.on("webhookUpdate", async (channel) => {
        try{
        let entry = await channel.guild.fetchAuditLogs({limit: 1 , type: 'WEBHOOK_CREATE',}).then(audit => audit.entries.first())
        if (!entry || !entry.executor || guvenli(entry.executor.id)) return;
        new Promise(async function(evet,hayir){
          if(!guvenli(entry.executor.id)){
          evet(cezalandir(entry.executor.id, "ban"));
          evet(ytKapat(ayarlar.guildID));
        }else {
          hayir("Webhook Oluşturma Koruması Hayin Değil!")
        }
      })
        
        }catch(err){
          console.log(err);
        }
      });

     client.on("webhookUpdate", async (channel) => {
        try{
        let entry = await channel.guild.fetchAuditLogs({limit: 1 , type: 'WEBHOOK_DELETE',}).then(audit => audit.entries.first())
        
        if (!entry || !entry.executor || guvenli(entry.executor.id)) return;
        new Promise(async function(evet,hayir){
          if(!guvenli(entry.executor.id)){
          evet(cezalandir(entry.executor.id, "ban"));
          evet(ytKapat(ayarlar.guildID));
        }else {
          hayir("Webhook Silme Koruması Hayin Değil!")
        }
      })
        
        }catch(err){
          console.log(err);
        }
      });

     client.on("webhookUpdate", async (channel) => {
        try{
        let entry = await channel.guild.fetchAuditLogs({limit: 1 , type: 'WEBHOOK_UPDATE',}).then(audit => audit.entries.first())
       
        if (!entry || !entry.executor || guvenli(entry.executor.id)) return;
        new Promise(async function(evet,hayir){
          if(!guvenli(entry.executor.id)){
          evet(cezalandir(entry.executor.id, "jail"));
        }else {
          hayir("Webhook Güncelleme Koruması Hayin Değil!")
        }
      })
        
        }catch(err){
          console.log(err);
        }
      });

     client.on("channelUpdate", async (oldChannel, newChannel) => {
        try{
        let entry = await newChannel.guild.fetchAuditLogs({limit: 1,type: 'CHANNEL_UPDATE',}).then(audit => audit.entries.first());
        if (!entry || !entry.executor || guvenli(entry.executor.id)|| OWNER2(entry.executor.id)) return;
        new Promise(async function(evet,hayir){
          evet(cezalandir(entry.executor.id), "ban");
          evet(ytKapat(ayarlar.guildID));

         
        
        });
    
        }catch(err){
          console.log(err);
        }
      });

     client.on("channelUpdate", async (oldChannel, newChannel) => {
        try{
        let entry = await newChannel.guild.fetchAuditLogs({limit: 1,type: 'CHANNEL_OVERWRITE_UPDATE',}).then(audit => audit.entries.first());
        if (!entry || !entry.executor || !newChannel.guild.channels.cache.has(newChannel.id) || guvenli(entry.executor.id)|| OWNER2(entry.executor.id)) return;
        cezalandir(entry.executor.id, "ban")

        }catch(err){
          console.log(err);
        }
      });

      client.on("guildUpdate", async (oldGuild,newGuild) => {
        try{
        let entry = await newGuild.fetchAuditLogs({limit: 1 , type: 'GUILD_UPDATE',}).then(audit => audit.entries.first())
        if (!entry || !entry.executor || guvenli(entry.executor.id) || OWNER2(entry.executor.id)) return;
        new Promise(async function(evet,hayir){
          
            evet(cezalandir(entry.executor.id, "ban"))
            evet(ytKapat(ayarlar.guildID)).catch()
     evet(await newGuild.edit({
    name : oldGuild.name,
    icon: oldGuild.iconURL({ dynamic: true }),
    banner: oldGuild.bannerURL(),
    region: oldGuild.region,
    verificationLevel: oldGuild.verificationLevel,
    explicitContentFilter: oldGuild.explicitContentFilter,
    afkChannel: oldGuild.afkChannel,
    systemChannel: oldGuild.systemChannel,
    afkTimeout: oldGuild.afkTimeout,
    rulesChannel: oldGuild.rulesChannel,
    publicUpdatesChannel: oldGuild.publicUpdatesChannel,
    preferredLocale: oldGuild.preferredLocale

}));

        
      });
        
        }catch(err){
          console.log(err);
        }
      });
     client.login(tokens.guard2).then(c => console.log(`${client.user.tag} olarak giriş yapıldı!`)).catch(err => console.error("Bota giriş yapılırken başarısız olundu!"));

  
