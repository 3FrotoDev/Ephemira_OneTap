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
    name: "limit",
  },
  async execute(message, args, client) {
    const { guild, member, channel } = message;

    const exe = new ConditionsToExcute(message, null, client);
    exe.categoryRoles = false;
    exe.invalid = false;
    exe.premium = false;
    await exe.execute(async () => {
      let limit = args[0];
      limit =
        Number(limit) >= 100 || Number(limit) < 1 || isNaN(limit) || !limit
          ? "99"
          : limit;
      //set channel limit
      await member.voice.channel.setUserLimit(limit);
      // success message
      await prefix.successfulAction(
        message,
        "limited the channel to ",
        limit,
        false
      );
    }, "message");
  },
};
