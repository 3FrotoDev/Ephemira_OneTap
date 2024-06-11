


const { getSetup } = require("../../libs/engines/engine.js");

const prefix = require("../../embeds/prefix.js");
const tools = require("../../libs/tools.js");


module.exports = {
  data: {
    name: "unclaim",
  },
  async execute(message, args, client) {
    const { guild, member, channel } = message;
    if (!tools.checkMemberInZone(guild.id, member))
    return await prefix.notInZone(
      message,
      getSetup(guild.id)["voiceId"]
    );
    const released = tools.releaseRoomOwnership(guild,member);
    if (released) {
      // successfully claimed
      await prefix.successfulAction(
        message,"Unclaimed the channel by ",
        `<@${member.id}>`,
        false
      );
    }else {
      // not owner
      await prefix.notTheRoomOwner(message, false, member);
    }
  },
};
