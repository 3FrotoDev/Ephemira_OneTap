const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
} = require("discord.js");
const fs = require('fs');


const tools = require("../../libs/tools.js");
const emojis = require("../../config/emojis/emojis.json");
const embeds = require("../../embeds/index.js");
const configFile = "C:/Users/akram/Desktop/Ephemira OneTap/src/db/logsrooms.json";
const { getOwnerByRoomId } = require("../../libs/engines/engine.js");
const { ConditionsToExcute } = require("../../libs/engines/classes.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-logs")
    .setDescription("Setup One Tap Logs")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) => option
      .setName("logs-channel")
      .setDescription("The channel to setup")
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true)
  ),
  async execute(interaction, client) {
    const { guild, member, channel, options } = interaction;
    let logsroom = options.getChannel("logs-channel");
    let channelId = logsroom.id;
    const guildId = interaction.guild.id;
    let configData = {};

    try {
        configData = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    } catch (error) {
        console.error('Error reading or parsing config file:', error);
    }

    configData[guildId] = { logChannel: channelId };

    fs.writeFileSync(configFile, JSON.stringify(configData, null, 4));

    interaction.reply({
        content: `Log channel has been set to ${interaction.guild.channels.cache.get(channelId)} for this server.`,
        ephemeral: true,
    });

    
     
  },
};
