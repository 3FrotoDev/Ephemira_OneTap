const { getSetup } = require("../../libs/engines/engine.js");
const prefix = require("../../embeds/prefix.js");
const tools = require("../../libs/tools.js");
const { rejectMemberFromRoom } = require("../../libs/tools.js");
const { ConditionsToExcute } = require("../../libs/engines/classes.js");
module.exports = {
  data: {
    name: "reject",
  },
  async execute(message, args, client) {
    const { guild, member, channel } = message;
    if (!tools.checkMemberInZone(guild.id, member)) {
      return await prefix.notInZone(message, getSetup(guild.id)["voiceId"]);
    }
    const targetId =
      message.mentions.roles.first()?.id ||
      message.mentions.members.first()?.id ||
      args[0];
    if (targetId) {
      const exe = new ConditionsToExcute(message, targetId, client);
      await exe.execute(async () => {
        let someId = targetId;
        const { op } = await tools.checkIfRoleOrUser(guild, someId);
        // user exist
        await rejectMemberFromRoom(guild, member, someId);

        // message here permitting user
        await prefix.successfulAction(
          message,
          `Rejected ${op}`,
          "From your channel",
          false
        );
      }, "message");
    } else {
      await message.reply(
        `use \`.v\` reject [@user/Id]\n\n example: \`.v reject \`[${message.member}/${message.member.id}] \n\n`
      );
    }
  },
};
