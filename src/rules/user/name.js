


const { getSetup } = require("../../libs/engines/engine.js");
const prefix = require("../../embeds/prefix.js");
const tools = require("../../libs/tools.js");
const {
  getOwnerByRoomId,
  
} = require("../../libs/engines/engine.js");

module.exports = {
  data: {
    name: "name",
  },
  async execute(message, args, client) {
    const { guild, member, channel } = message;
    // you are not in a room
    if (!tools.checkMemberInZone(guild.id, member))
      return await prefix.notInZone(
        message,
        getSetup(guild.id)["voiceId"]
      );
    const name = args.join(" ");
    if(name){
  if (getOwnerByRoomId(guild.id, member.voice.channel.id) == member.id) {
      const { isEdited, timeout } = await tools.handleCooldown(
        client,
        guild,
        member,
        name
      );
      if (!isEdited) {
        await prefix.successfulAction(
          message,
          "named the channel to: \n",
          name,
          false
        );
      } else {
        await prefix.actionAfterXMinutes(message,`named \`\`\`${name}\`\`\``, timeout,  false);
      }
    } else {
      //Not your room
      await prefix.notTheRoomOwner(message, false, member);
    }

    }else {

    }
  },
};
