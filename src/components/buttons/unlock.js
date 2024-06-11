const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const tools = require("../../libs/tools.js");
const emojis = require("../../config/emojis/emojis.json");
const embeds = require("../../embeds/index.js");
const { getSetup } = require("../../libs/engines/engine.js");
const { ConditionsToExcute } = require("../../libs/engines/classes.js");

module.exports = {
  data: {
    name: "xunlock",
  },
  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });
    const { guild, member, channel } = interaction;
    const exe = new ConditionsToExcute(interaction, null, client);
    // disactive conditions
    exe.invalid = false;
    exe.premium = false;
    //new modal that the user can type in
    await exe.execute(async () => {
      const permissions = member.voice.channel.permissionsFor(guild.id);
      if (permissions.has(PermissionFlagsBits.Connect)) {
        await embeds.room.AlreadyAction(
          interaction,
          "Room is Already unlocked Mr.",
          `<@${member.id}>`,
          true
        );
        setTimeout(() => {
          interaction.deleteReply();
        },5000)
      } else {
        await member.voice.channel.permissionOverwrites.edit(guild.id, {
          Connect: true,
        });
        await embeds.room.successfulAction(
          interaction,
          "unlocked",
          " the voice channel",
          true
        );
        setTimeout(() => {
          interaction.deleteReply();
        },5000)
      }
    });
    //unlock message
  },
};
