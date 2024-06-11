const emojis = require("../config/emojis/emojis.json");
const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require("discord.js");
async function voiceNotDefined(interaction) {
  // voice not exist.
  await interaction.deferReply({ ephemeral: true });
  await interaction.editReply({
    content: "This is not a voice channel",
    ephemeral: true,
  });
}

async function voiceSuccessfullySet(interaction, voice) {
  await interaction.deferReply();
  const embed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle("Setup successful")
    .setDescription(
      `Setup the channel ${voice.name} as join to create channel`
    );
  await interaction.editReply({ embeds: [embed] });
}
async function roomSuccessfullySet(interaction, choice) {
  await interaction.deferReply({ ephemeral: true });
  await interaction.editReply({
    content: `${emojis.success} ${choice} room is successfully setup! `,
    ephemeral: true,
  });
}
async function categoryNotDefined(interaction) {
  //this voice must be a in a category
  await interaction.deferReply({ ephemeral: true });
  await interaction.editReply({
    content: "This voice must be a in a category",
    ephemeral: true,
  });
}
async function categorySuccessfullySet(interaction) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Setup successful")
        .setDescription(`${emojis.success} Category successfully setup`),
    ],
  });
}
//you don't have permission to use this command
async function noPermission(interaction, ephemeral) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("Permission error")
        .setDescription(`${emojis.error} You don't have permission to use this command`),
    ],
    ephemeral
  });
}

async function categoryAlreadyUsed(interaction) {
  await interaction.deferReply({ ephemeral: true });
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle("Already used")
        .setDescription(`${emojis.success} Category already used for other rooms`),
    ],
  });
}


module.exports = {
  categoryNotDefined,
  voiceSuccessfullySet,
  voiceNotDefined,
  roomSuccessfullySet,
  categorySuccessfullySet,
  categoryAlreadyUsed,
};
