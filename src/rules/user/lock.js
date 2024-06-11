const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const { ConditionsToExcute } = require("../../libs/engines/classes.js");
const prefix = require("../../embeds/prefix.js");

module.exports = {
  data: {
    name: "lock",
  },
  async execute(message, args, client) {
    const { guild, member, channel } = message;
    // you are not in a room
    const exe = new ConditionsToExcute(message, null, client);
    exe.premium = false;
    exe.invalid = false;
    exe.categoryRoles = false;
    await exe.execute(async () => {
      const permissions = member.voice.channel.permissionsFor(guild.id);
      if (!permissions.has(PermissionFlagsBits.Connect)) {
        await prefix.AlreadyAction(
          message,
          "Room is Already locked Mr.",
          `<@${member.id}>`,
          false
        );
      } else {
        await member.voice.channel.permissionOverwrites.edit(guild.id, {
          Connect: false,
        });
        await member.voice.channel.permissionOverwrites.edit(member.id, {
          Connect: true,
        });
        // locked message
        await prefix.successfulAction(
          message,
          "locked",
          " the voice channel",
          false
        );
      }
    }, "message"); //
  },
};
