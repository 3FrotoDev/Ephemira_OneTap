


const { getSetup } = require("../../libs/engines/engine.js");

const prefix = require("../../embeds/prefix.js");
const tools = require("../../libs/tools.js");
const {
  getOwnerByRoomId,
 
} = require("../../libs/engines/engine.js");

module.exports = {
  data: {
    name: "permit",
  },
  async execute(message, args, client) {
    const { guild, member, channel } = message;
    
    //give perm to user or role or all
    if (!tools.checkMemberInZone(guild.id, member))
      return await prefix.notInZone(
        message,
        getSetup(guild.id)["voiceId"]
      );
     const targetId = message.mentions.roles.first()?.id || message.mentions.members.first()?.id || args[0]
     if(targetId) {
 if (getOwnerByRoomId(guild.id, member.voice.channel.id) == member.id) {
      // is owner.
      let someId = targetId;
      let op = "";
      if (someId == member.id)
        return await prefix.notYourself(message, false); // you can't use that on you.
      //  get server roles
      let role = await guild.roles.cache.get(someId);
      let user = await guild.members.cache.get(someId);
      if (someId != member.id) {
        if (user) {
          someId = user.id;
          op = `<@${someId}>`;
        } else if (role) {
          someId = role.id;
          op = `<@&${someId}>`;
        } else {
          someId = null;
        }
      }
      if (someId) {
        // user exist
        await member.voice.channel.permissionOverwrites.edit(someId, {
          Connect: true,
          SendMessages: true,
        });
        // message here permitting user.
        await prefix.successfulAction(
          message,
          "permitted",
          `${op} to your channel`,
          false
        );
      } else {
        /// user not exist
        await prefix.undefinedID(message, false);
      }
    } else {
      // not owner.
      if (getOwnerByRoomId(guild.id, member.voice.channel.id)) {
        // console.log(getOwnerByRoomId(guild.id, member.voice.channel.id));
        await prefix.notTheRoomOwner(message, false, member);
      } else {
        // console.log(getOwnerByRoomId(guild.id, member.voice.channel.id));
        await prefix.roomHasNoOwner(message, false);
      }
    }
    }else {
      await message.reply(
        `use \`.v\` permit [@user/Id]\n\n example: \`.v permit \`[${message.member}/${message.member.id}] \n\n`,
      );
    }
   
  },
};
