require("dotenv").config();
const { token } = process.env;
const {
  Client,
  Collection,
  EmbedBuilder,
  ActionRowBuilder
} = require("discord.js");
const fs = require("fs");
const emojis = require("./config/emojis/emojis.json");
const sys = require("./config/system.json");

// const cron = require('node-cron');

const client = new Client({ intents: 3276799 });


client.commands = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();
client.modals = new Collection();
client.commandArray = [];
client.rules = new Collection();
client.utils = new Collection();
client.coolDown = new Map();
client.animate = emojis;
client.system = sys;
client.messageOwner = new Map();
//set custom status for the bot

const functionFolders = fs.readdirSync("./src/functions");
for (const folder of functionFolders) {
  const functionFiles = fs
    .readdirSync(`./src/functions/${folder}`)
    .filter((file) => file.endsWith(".js"));
  for (const file of functionFiles) {
    require(`./functions/${folder}/${file}`)(client);
  }
}



client.on("ready", () => {
  client.user.setActivity("# Stride Studio", { type: "STREAMING" });
  console.log(`${client.user.username} is online.`);
  console.log(`${client.guilds.cache.size} servers.`);
  console.log(`${client.users.cache.size} users.`);
  console.log(`${client.channels.cache.size} channels.`);
  console.log(`${client.commandArray.length} commands.`);
  console.log(`${client.rules.size} rules.`);
  console.log(`${client.utils.size} utils.`);
  console.log(`${client.animate.length} emojis.`);
  console.log(`${client.system.prefix} prefix.`);
  console.log(`${client.coolDown.size} cooldowns.`);
  console.log(`${client.messageOwner.size} message owners.`);
  console.log(`${client.modals.size} modals.`);
  console.log(`${client.selectMenus.size} select menus.`);
  console.log(`${client.buttons.size} buttons.`);
  console.log(`${client.commands.size}`);
});




client.handleEvents();
client.handleCommands();
client.handleRules();
client.handleUtils();
client.handleComponents();

client.on(`interactionCreate`, async interaction => {
  if (interaction.customId == "starter") {
      if (interaction.values[0] === "bulbasaur"){
        const ppEmbed = new EmbedBuilder()
                .setColor(0x4a89bd)
                .setAuthor({ name: 'Voice Commands', iconURL: 'https://cdn.discordapp.com/avatars/1220409826652192778/f3f99be3d632e8beded1567eaa3d05ad.png?size=1024'})
                .addFields(
                    { name: '.v lock', value: '<:arrow:1226287864896028714> Locks The Voice Channel', inline:true },
                    { name: '.v unlock', value: '<:arrow:1226287864896028714> Unlocks The Voice Channel', inline:true },
                    { name: '.v show', value: '<:arrow:1226287864896028714> Shows The Voice Channel', inline:true },
                    { name: '.v hide', value: '<:arrow:1226287864896028714> Hides The Voice Channel', inline:true },
                    { name: '.v permit', value: '<:arrow:1226287864896028714> Gives Permission To a User To Join The Room', inline:true },
                    { name: '.v cam on/off', value: '<:arrow:1226287864896028714> Enable/Disable The Cam', inline:true },
                    { name: '.v activity on/off', value: '<:arrow:1226287864896028714> Enable/Disable Activity', inline:true },
                    { name: '.v claim', value: '<:arrow:1226287864896028714> Claim The Voice Channel', inline:true },
                    { name: '.v unclaim', value: '<:arrow:1226287864896028714> Unclaim The Voice Channel', inline:true },
                    { name: '.v limit [Number]', value: '<:arrow:1226287864896028714> Set The Users Limit To a Room', inline:true },
                    { name: '.v mute', value: '<:arrow:1226287864896028714> Mute a User ', inline:true },
                    { name: '.v unmute', value: '<:arrow:1226287864896028714> Unmute a User', inline:true },
                    { name: '.v reject', value: '<:arrow:1226287864896028714> Reject a User', inline:true },
                    { name: '.v sb on/ff', value: '<:arrow:1226287864896028714> Enable/Disable The Soundboard Feature', inline:true },
                    { name: '.v transfer', value: '<:arrow:1226287864896028714> Unclaim The Voice Channel', inline:true },
                    { name: '.v name', value: '<:arrow:1226287864896028714>Rename The Voice Channel', inline:true },
                    { name: '.v owner', value: '<:arrow:1226287864896028714> View The Room Owner', inline:true },
                    { name: '.v ping', value: '<:arrow:1226287864896028714> Check The Bot Ping', inline:true },


                )
        interaction.reply({embeds: [ppEmbed], ephemeral:true})
      }
      if (interaction.values[0] === "charmander"){
        const ppEmbed = new EmbedBuilder()
                .setColor(0x4a89bd)
                .setAuthor({ name: 'Setup Commands', iconURL: 'https://cdn.discordapp.com/avatars/1220409826652192778/f3f99be3d632e8beded1567eaa3d05ad.png?size=1024'})
                .setDescription('All The Setup Commands Are With Slash Commands, Use Slash Commands To Get Them')
                .addFields(
                    { name: '/setup', value: '<:arrow:1226287864896028714> Setup One Tap System In Your Server', inline:true },
                    { name: '/edit-embed', value: '<:arrow:1226287864896028714> Edit Interface Embed', inline:true },
                    { name: '/setup-logs', value: '<:arrow:1226287864896028714> Setup Logs System In Your Server', inline:true },
 


                )
        interaction.reply({embeds: [ppEmbed], ephemeral:true})
      }
      if (interaction.values[0] === "squirtle"){
        const ppEmbed = new EmbedBuilder()
                .setColor(0x4a89bd)
                .setAuthor({ name: 'Setup Commands', iconURL: 'https://cdn.discordapp.com/avatars/1220409826652192778/f3f99be3d632e8beded1567eaa3d05ad.png?size=1024'})
                .setDescription('All The Setup Commands Are With Slash Commands, Use Slash Commands To Get Them')
                .addFields(
                    { name: '/setup', value: '<:arrow:1226287864896028714> Setup One Tap System In Your Server', inline:true },
                    { name: '/edit-embed', value: '<:arrow:1226287864896028714> Edit Interface Embed', inline:true },
                    { name: '/setup-logs', value: '<:arrow:1226287864896028714> Setup Logs System In Your Server', inline:true },
 


                )
        interaction.reply({content:'**Not Avaiable [Soon]**', ephemeral:true})
      }
    }
  })

  process.on("uncaughtException", (error) => {
    return console.error(error);
  });
  
  process.on("unhandledRejection", (error) => {
    return console.error(error);
  });
  
  process.on("rejectionHandled", (error) => {
    return console.error(error);
  });
// the login bot here.
client.login(token);
