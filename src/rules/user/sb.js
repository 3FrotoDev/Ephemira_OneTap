



const { ConditionsToExcute } = require("../../libs/engines/classes.js");
const prefix = require("../../embeds/prefix.js");
const tools = require("../../libs/tools.js");
const {
  getOwnerByRoomId,
  getManagersList
} = require("../../libs/engines/engine.js");

module.exports = {
  data: {
    name: "sb",
  },
  async execute(message, args, client) {
    const { guild, member } = message;
    const banType = args[0];
    if (banType == "off" ||
      banType == "on"
    ) {
      const someId = message.mentions.roles.first()?.id ||
        message.mentions.members.first()?.id ||
        args[1] || guild.id;
        const { some, op } = await tools.checkIfRoleOrUser(guild, someId);
        const mention = op;
      const exe = new ConditionsToExcute(message, someId, client);
      await exe.execute(async () => {
        if(banType == "on"){
          await member.voice.channel.permissionOverwrites.edit(someId, {
            UseSoundboard: true,
          });
          await prefix.successfulAction(
            message,
            "enabled soundboard for ",
            mention,
            false
          );

          
        }else if(banType == "off") {

          await member.voice.channel.permissionOverwrites.edit(someId, {
            UseSoundboard: false,
          });
          await member.voice.channel.permissionOverwrites.edit(
            getOwnerByRoomId(guild.id, member.voice.channel.id),
            { UseSoundboard: true }
          );
          getManagersList(guild.id,member.voice.channel.id).forEach(async (uid) => {
            const u = await guild.members.cache.get(uid);
            if (u) {
              await member.voice.channel.permissionOverwrites.edit(u.id, {
                UseSoundboard: true,
              });
            }
          });
          await prefix.successfulAction(
            message,
            "disabled soundboard for ",
            mention,
            false
          );

        }
      }, "message");
    } else {
      // reply use prefix + ban [add/remove/show]
      await message.reply(
        `use \`.v\` sb [on/off] \n\n example: \`.v sb off @user\` \n\n`,
      );
    }
  },
};