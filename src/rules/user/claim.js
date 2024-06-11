const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");


const { getSetup, getBwbList } = require("../../libs/engines/engine.js");
const { ConditionsToExcute } = require("../../libs/engines/classes.js");
const prefix = require("../../embeds/prefix.js");
const tools = require("../../libs/tools.js");
const {
  getOwnerByRoomId,
  addManager,
  removeManager,
  getManagersList,
} = require("../../libs/engines/engine.js");

  module.exports = {
    data: {
      name: "claim",
    },
    async execute(message, args, client) {
    const { guild, member, channel } = message;
    if (!tools.checkMemberInZone(guild.id, member))
    return await prefix.notInZone(
      message,
      getSetup(guild.id)["voiceId"]
    );

    const { claimed, oldOwnerId } = tools.claimRoomfromOwner(guild,member);

    if(claimed){
      //succcessfully claimed
      await prefix.successfulAction(message, `Claimed ${channel} by `,`<@${member.id}>`,false);
    }
    else{
      //already claimed
      await prefix.AlreadyAction(message, ` claimed by <@${oldOwnerId}>`,`<#${member.voice.channel.id}>`, false);
    }
  },
};




