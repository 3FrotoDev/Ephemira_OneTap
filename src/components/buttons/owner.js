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
  const { getSetup, getOwnerByRoomId } = require("../../libs/engines/engine.js");

  
  module.exports = {
    data: {
      name: "xowner",
    },
    async execute(interaction, client) {
      
      const { guild, member, channel } = interaction;

      //user claims the room after he clicks
      if (!tools.checkMemberInZone(guild.id, member)) {
        await interaction.deferReply({ ephemeral: true});
        return await embeds.room.notInZone(interaction,getSetup(guild.id)["voiceId"]);
      }
      await interaction.deferReply({ ephemeral: true });
      const ownerId = getOwnerByRoomId(guild.id, member.voice.channel.id);
      if (ownerId) {
        await embeds.room.showDetails(interaction,"This room is owned by",`<@${ownerId}>`,true);
        setTimeout(() => {
          interaction.deleteReply();
        },5000)
      } else {
        await embeds.room.roomHasNoOwner(interaction, true);
        setTimeout(() => {
          interaction.deleteReply();
        },5000)
      }
    },
  };
  