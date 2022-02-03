module.exports = {
  apps : [
{
  name: "Moderation-bot-main",
  script: "index.js",
  watch: true,
  ignore_watch: "node_modules",
  exec_mode: "cluster",
  cwd: "./MyBots/Moderation",
  env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
},
{
  name: "Stat-bot-main",
  script: "index.js",
  ignore_watch: "node_modules",
  watch: true,
  cwd: "./MyBots/Stat",
  env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
},
/*
{
  name: "Guard1-bot-main",
  script: "index.js",
  watch: false,
  exec_mode: "cluster",
  cwd: "./MyBots/Guard"
},
{
  name: "Guard2-bot-main",
  script: "index.js",
  watch: false,
  exec_mode: "cluster",
  cwd: "./MyBots/Guard2"
},
*/
/*
{
  name: "Backup-bot-main",
  script: "index.js",
  watch: false,
  exec_mode: "cluster",
  cwd: "./MyBots/ChannelBackup",
  env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
},

/*
{
  name: "Backup2-bot-main",
  script: "index.js",
  watch: false,
  exec_mode: "cluster",
  cwd: "./MyBots/Backup"
},

*/


  ]
}
