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
const { ConditionsToExcute } = require("../../libs/engines/classes.js");

module.exports = {
  data: {
    name: "mreject"
  },
  async execute(interaction, client) {
    
    const { guild, member, values, channel } = interaction;
    // console.log(interaction)
    //user claims the room after he clicks
    const exe = new ConditionsToExcute(interaction, null, client);
    // disactive conditions
    exe.invalid = false;
    exe.premium = false;

    if(!( client.messageOwner.get(interaction.message.id) == member.id || member.id == getOwnerByRoomId(guild.id,member.voice.channel.id))) return await interaction.deferReply({ephemeral: true}) , await interaction.followUp({content:"You can't use this menu not for you!"});
    await interaction.deferReply();
    exe.execute(async () => {
        const usersId = values;
        for (let userId of usersId) {
            await member.voice.channel.permissionOverwrites.edit(userId, {
                Connect: false,
              });
            await tools.rejectMemberFromRoom(guild,member,userId);
        }
        await interaction.message.delete();
        await interaction.editReply({content:usersId.map(u =>`<@${u}> rejected successfully`).join("\n")});
    });
  },
};
