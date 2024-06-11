

const { getSetup } = require("../../libs/engines/engine.js");

const prefix = require("../../embeds/prefix.js");
const tools = require("../../libs/tools.js");
const {
  getOwnerByRoomId
} = require("../../libs/engines/engine.js");

module.exports = {
  data: {
    name: "owner",
  },
  async execute(message, args, client) {
    const { guild, member, channel } = message;
    // you are not in a room
    if (!tools.checkMemberInZone(guild.id, member))
      return await prefix.notInZone(
        message,
        getSetup(guild.id)["voiceId"],
        false
      );

    const ownerId = getOwnerByRoomId(guild.id, member.voice.channel.id);
    if (ownerId) {
      //get the room owner and send a interaction
      await prefix.showDetails(
        message,
        "This room is owned by",
        `<@${ownerId}>`,
        false
      );
    } else {
      // you can claim the room
      await prefix.roomHasNoOwner(message, false);
    }
  },
};
