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
    name: "xunclaim",
  },

  async execute(interaction, client) {
    await interaction.deferReply({ephemeral:true}); // thinking.
    const { guild, member, channel } = interaction;
    const exe = new ConditionsToExcute(interaction, null, client);
    exe.invalid = false;
    exe.ownerOrManager = false;
    exe.premium = false;
    await exe.execute(async () => {
      const released = tools.releaseRoomOwnership(guild, member);
      if (released) {// successfully claimed
        await embeds.room.successfulAction(interaction,"Unclaimed the channel by ",`<@${member.id}>`,true);
        setTimeout(() => {
          interaction.deleteReply();
        },5000)
      } else {// not owner
        await embeds.room.notTheRoomOwner(interaction, true, member);
        setTimeout(() => {
          interaction.deleteReply();
        },5000)
      }
    });
  },
};
