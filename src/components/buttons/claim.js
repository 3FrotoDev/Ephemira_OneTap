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

module.exports = {
  data: {
    name: "claim-room",
  },
  async execute(interaction, client) {
    const { guild, member, channel } = interaction;
    //user claims the room after he clicks
    if (!tools.checkMemberInZone(guild.id, member)) {
      return (
        await interaction.deferReply({ ephemeral: true}),
        await embeds.room.notInZone(interaction, getSetup(guild.id)["voiceId"])
      );
    }
    await interaction.deferUpdate({ ephemeral: true });
    const { claimed, oldOwnerId } = tools.claimRoomfromOwner(guild, member);
    if (!claimed) {
      //room has owner
      await embeds.room.AlreadyAction(
        interaction,
        "This channel is already Owned by ",
        `<@${oldOwnerId}>`,
        true
      );
      setTimeout(() => {
        interaction.deleteReply();
      },5000);
    } else {
      await embeds.room.successfulAction(
        interaction,
        `Claimed ${channel} by `,
        `<@${member.id}>`,
        true
      );
      setTimeout(() => {
        interaction.deleteReply();
      },5000)
    }
  },
};
