const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

const tools = require("../../libs/tools.js");
const emojis = require("../../config/emojis/emojis.json");
const embeds = require("../../embeds/index.js");
const { getSetup, getOwnerByRoomId, getManagersList } = require("../../libs/engines/engine.js");
const { ConditionsToExcute } = require("../../libs/engines/classes.js");
const { text } = require("express");

module.exports = {
  data: {
    name: "xname",
  },
  async execute(interaction, client) {
    const { guild, member, channel } = interaction;
    //check if the user is in a room
    if (!tools.checkMemberInZone(guild.id, member)) {
      await interaction.deferReply({ephemeral: true});
      return await embeds.room.notInZone(
        interaction,
        getSetup(guild.id)["voiceId"]
      );
    }

    if (!getOwnerByRoomId(guild.id, member.voice.channel.id)) {
      await interaction.deferReply();
      return await embeds.room.roomHasNoOwner(interaction, true);
    }
    // console.log(getManagersList(guild.id, member.voice.channel.id).includes(member.id));
    if ((getOwnerByRoomId(guild.id, member.voice.channel.id)) != member.id) {
      if(!getManagersList(guild.id, member.voice.channel.id).includes(member.id)){
     
        return await interaction.reply({content: 'The Room Has No Owner', ephemeral:true})
      }
    }
    //remove the first defer
    const modal = new ModalBuilder()
      .setCustomId("xname")
      .setTitle("Change Name");
    const input = new TextInputBuilder()
      .setCustomId("name")
      .setLabel("Name")
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMinLength(3)
      .setMaxLength(20);
    const actionRow = new ActionRowBuilder().addComponents(input);
    modal.addComponents(actionRow);
    await interaction.showModal(modal);
  },
};
