module.exports = function() {
  const { Client } = require("discord.js");
  const { CronJob } = require("cron");
  const fs = require("fs");


  const cfg = require("../index.json");

  const moment = require("moment");
  require("moment-duration-format");
  const mongoose = require("mongoose");
  const Database = require("../models/stat.js")
  const client = new Client({ disableMentions: "everyone", ignoreDirect: true, ignoreRoles: true, fetchAllMembers: true, _tokenType: "Bot" });
  //------------//
  client.commands = new Map();
  client.aliases = new Map();
  client.MessageMap = new Map();
  client.VoiceMap = new Map();
  process.client = client;
  //------------//
  require("../Assets/login.js")(client);
  require("../Assets/load.js")(fs, client);
  require("../Assets/functions.js")(client, cfg, moment);
  require("../Assets/commandHandler.js")(fs, client);
  require("../Assets/mongoConnect.js")(mongoose, cfg);
  require("../Assets/haftalikSifirlama.js")(CronJob, Database, client, cfg);
  //------------//
  
  


  
  
  
  
  
};
