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
      name: "xcamoff",
    },
    async execute(interaction, client) {
      await interaction.deferReply({ephemeral:true});
  
      const { guild, member, channel } = interaction;
      //user claims the room after he clicks
      const exe = new ConditionsToExcute(interaction, null, client);
      // disactive conditions
      exe.invalid = false;
      exe.premium = false;
      exe.execute(async () => {
        const permissions = member.voice.channel.permissionsFor(guild.id);
        if (!permissions.has(PermissionFlagsBits.Stream)) {
          await embeds.room.AlreadyAction(interaction,"Stream is Already disabled","...",true);
          setTimeout(() => {
            interaction.deleteReply();
          },5000);
        } else {
          await member.voice.channel.permissionOverwrites.edit(guild.id, {
            Stream: false,
          });
          await member.voice.channel.permissionOverwrites.edit(member.id, {
            Stream: true,
          });
          // locked message
          await embeds.room.successfulAction(interaction,"Disabled"," Cam & Stream for all members",true);
          setTimeout(() => {
            interaction.deleteReply();
          },5000);
        }
      });
    },
  };