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
      name: "xonsb",
    },
    async execute(interaction, client) {
      await interaction.deferReply({ephemeral:true});
  
      const { guild, member, channel } = interaction;
      //
      const exe = new ConditionsToExcute(interaction, null, client);
      // disactive conditions
      exe.invalid = false;
      exe.premium = false;
      exe.execute(async () => {
        const permissions = member.voice.channel.permissionsFor(guild.id);
        if (permissions.has(PermissionFlagsBits.UseExternalSounds)) {
          await embeds.room.AlreadyAction(interaction,"Soundboard is already active Mr.",`<@${member.id}>`, true);
          setTimeout(() => {
            interaction.deleteReply();
          },5000);
        }
         else {
          await member.voice.channel.permissionOverwrites.edit(guild.id, {
            UseSoundboard: true,
            UseExternalSounds:true,
          });
          // locked message
          await embeds.room.successfulAction(interaction,"Enabled Soundboard"," For all members", true);
          setTimeout(() => {
            interaction.deleteReply();
          },5000);
        }
      });
    },
  };
  