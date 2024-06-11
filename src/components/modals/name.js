const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
} = require("discord.js");

const tools = require("../../libs/tools.js");
const emojis = require("../../config/emojis/emojis.json");
const embeds = require("../../embeds/index.js");
const { getSetup } = require("../../libs/engines/engine.js");
const { ConditionsToExcute } = require("../../libs/engines/classes.js");

module.exports = {
  data: {name: "xname",},
  async execute(interaction, client) {
    const { guild, member, channel, fields } = interaction;
    //user claims the room after he clicks
    const name = fields.getTextInputValue("name");
    const { isEdited, timeout } = await tools.handleCooldown(
      client,
      guild,
      member,
      name
    );
    if (!isEdited) {
      await interaction.reply({
        content: `Successfully named the channel to: \n\`\`\`${name}\`\`\``,
        ephemeral: true,
      });
    } else {
      const dateNow = Date.now();
      const timeoutDuration = timeout * 60 * 1000;
      const newTime = Math.floor((dateNow + timeoutDuration) / 1000);
      const initialEmbedawait = new EmbedBuilder()
        .setColor("Yellow")
        .setDescription(
          `Your channel will be named \`\`\`${name}\`\`\` <t:${newTime}:R>`
        );
      const timeoutEndsEmbed = new EmbedBuilder()
        .setColor("Green")
        .setDescription(`Your channel is now named \`\`\`${name}\`\`\``);
      if (timeout != 0) {
        await interaction.reply({ embeds: [initialEmbedawait] });
      }
      //send the timoutends embed after timout goes to 0
      setTimeout(async () => {
        await interaction.editReply({ embeds: [timeoutEndsEmbed] });
      }, timeoutDuration);
    }
  },
};

