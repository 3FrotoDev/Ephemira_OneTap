const {
  InteractionType,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
//

const tools = require("../../libs/tools.js");
const emojis = require("../../config/emojis/emojis.json");
const { getState } = require("../../libs/engines/guildChecker.js");
module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    let isWhiteList = true;
    // connect to database:
    if (interaction.guild) {
      //here check if whitelist true false.
      isWhiteList = getState(interaction.guild.id);
      if (!(isWhiteList || tools.isCuldaDev(interaction.member.id))) {
        await interaction.deferReply({ ephemeral: true });
        const Embed = new EmbedBuilder().setColor("#0cf317").setDescription(`${emojis.crown} This commands need Premium access to use`);
        const Row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setURL(`https://discord.gg/culda`)
            .setStyle(ButtonStyle.Link)
            .setLabel(`Culda Studio`)
          // .setEmoji("<:PrimePing:1126803312738570271>")
        );

        return await interaction.editReply({
          ephemeral: true,
          embeds: [Embed],
          components: [Row],
        });
      }
      // Assuming 'interaction' is the interaction object
      const botMember = await interaction.guild.members.cache.get(
        interaction.client.user.id
      );
      if (!botMember.permissions.has(PermissionFlagsBits.Administrator))
        return await interaction.reply({
          content: `${emojis.warn}  I don't have the permission to do this action.`,
        });
    }

    if (interaction.isChatInputCommand()) {
      const { commands } = client;
      const { commandName } = interaction;
      const command = commands.get(commandName);
      if (!command) return;
      
      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.log(error);
      }
    } else if (interaction.isButton()) {
      const { buttons } = client;
      const { customId } = interaction;
      const button = buttons.get(customId);
      if (!button) return new Error("There is no code for this button.");
      try {
        await button.execute(interaction, client);
      } catch (err) {
        console.error(err);
      }
    } else if (interaction.isStringSelectMenu()) {
      const { selectMenus } = client;
      const { customId } = interaction;
      const menu = selectMenus.get(customId);
      if (!menu) return new Error("There is no code for this select menu.");
      try {
        await menu.execute(interaction, client);
      } catch (error) {
        console.error(error);
      }
    } else if (interaction.type == InteractionType.ModalSubmit) {
      const { modals } = client;
      const { customId } = interaction;
      const modal = modals.get(customId);
      if (!modal) return new Error("There is no code for this modal.");
      try {
        await modal.execute(interaction, client);
      } catch (e) {
        console.error(e);
      }
    }
  },
};
