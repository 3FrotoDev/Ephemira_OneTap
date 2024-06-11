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
      name: "xguide",
    },
    async execute(interaction, client) {
      await interaction.deferReply({ ephemeral: true});
  
      const { guild, member, channel } = interaction;
      //user claims the room after he clicks
      const exe = new ConditionsToExcute(interaction, null, client);
      // disactive conditions
      exe.invalid = false;
      exe.premium = false;
      exe.ownerOrManager = false;
      exe.execute(async () => {
        //send a message to the channel telling the guide is comming soon..
        await interaction.editReply({
          content: `Guide is coming soon...`,
        });
        setTimeout(() => {
          interaction.deleteReply();
        },5000)
      });
    },
  };
  