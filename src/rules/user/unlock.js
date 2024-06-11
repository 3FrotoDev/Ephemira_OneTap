const { PermissionFlagsBits } = require("discord.js");

const { ConditionsToExcute } = require("../../libs/engines/classes.js");
const prefix = require("../../embeds/prefix.js");

module.exports = {
  data: {
    name: "unlock",
  },
  async execute(message, args, client) {
    const { guild, member, channel } = message;
    // you are not in a room
    const exe = new ConditionsToExcute(message, null, client);
    exe.premium = false;
    exe.invalid = false;
    exe.categoryRoles = false;
    await exe.execute(async () => {
      // is owner
      //room owner
      const permissions = member.voice.channel.permissionsFor(guild.id);
      if (permissions.has(PermissionFlagsBits.Connect)) {
        await prefix.AlreadyAction(
          message,
          "Room is Already unlocked Mr.",
          `<@${member.id}>`,
          false
        );
      } else {
        await member.voice.channel.permissionOverwrites.edit(guild.id, {
          Connect: true,
        });
        await prefix.successfulAction(
          message,
          "unlocked",
          " the voice channel",
          false
        );
      }
    },"message");
  },
};
