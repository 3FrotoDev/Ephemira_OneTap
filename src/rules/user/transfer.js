const { ConditionsToExcute } = require("../../libs/engines/classes.js");
const prefix = require("../../embeds/prefix.js");
const tools = require("../../libs/tools.js");
const { getSetup, getOwnerByRoomId } = require("../../libs/engines/engine.js");
const { flatten } = require("discord.js");

module.exports = {
  data: {
    name: "transfer",
  },
  async execute(message, args, client) {
    const { guild, member, channel } = message;
    // you are not in a room
    const targetId = message.mentions.members.first()?.id || args[0];
    // console.log(targetId)
    if (targetId) {
      const exe = new ConditionsToExcute(message, targetId, client);
      exe.premium = false;
      await exe.execute(async () => {
        const user = await guild.members.cache.get(targetId);
        const { transfered } = tools.transferOwnership(
          guild,
          member,user);
        // message transfered successfully.
        if (transfered) {
          await prefix.successfulAction(
            message,
            "Transfered your room to ",
            `<@${user.id}>`,
            false
          );
        } else {
          await message.reply(
            `this member is not in room!`
          );
        }
      }, "message");
    } else {
      await message.reply(
        `use \`.v\` transfer [@user/Id]\n\n example: \`.v transfer \`[${message.member}/${message.member.id}] \n\n`
      );
    }

    //transfer room owner
  },
};
