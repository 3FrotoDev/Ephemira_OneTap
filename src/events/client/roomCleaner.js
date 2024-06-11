const {
  Events,
  InteractionType,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require('fs');
const CULDA = require("../../config/devs/culda.json");
const { addGuild } = require("../../libs/engines/guildChecker.js");
const { generateOneTapDb, cleanChannelFromData } = require("../../libs/engines/engine.js");
const configFile = "C:/Users/akram/Desktop/Ephemira OneTap/src/db/logsrooms.json";
let configData = {};
configData = JSON.parse(fs.readFileSync(configFile, 'utf8'));
module.exports = {
  name: Events.ChannelDelete,
  async execute(channel, client) {
    cleanChannelFromData(channel.guild.id, channel.id);
    const guildId = channel.guild.id;
    const logChannelId = configData[guildId].logChannel;
    const logChannel = channel.guild.channels.cache.get(logChannelId);
   
    const channelIdBeforeDeletion = channel.id;

    const ppEmbed = new EmbedBuilder()
              .setColor(0xFF0000)
              .setTitle(`Ephemira's Temporary Channel Logs`)
              .setDescription(`Temporary Channel Deleted, The Room Was For \`${channelIdBeforeDeletion}\``)
              .setTimestamp()
logChannel.send({embeds:[ppEmbed]})
  },
};
