



const { ConditionsToExcute } = require("../../libs/engines/classes.js");
const prefix = require("../../embeds/prefix.js");
const tools = require("../../libs/tools.js");



module.exports = {
  data: {
    name: "show",
  },
  async execute(message, args, client) {
    const { guild, member, channel } = message;
    // you are not in a room
    const someId = guild.id;
    const { some, op } = await tools.checkIfRoleOrUser(guild, someId);
    const mention = op;
    const exe = new ConditionsToExcute(message, someId, client);
    exe.commandName = "ghost";
     await exe.execute( async() =>{
      await member.voice.channel.permissionOverwrites.edit(someId, {
        ViewChannel: true,
      });
      await prefix.successfulAction(
        message,
        mention,
        " Now can see your channel",
        false
      );
    },"message"); // 
  },
};
