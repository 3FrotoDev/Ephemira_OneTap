



const { ConditionsToExcute } = require("../../libs/engines/classes.js");
const prefix = require("../../embeds/prefix.js");
const tools = require("../../libs/tools.js");




module.exports = {
  data: {
    name: "unmute",
  },
  async execute(message, args, client) {
    const { guild, member, channel } = message;

    let someId =
      message.mentions.roles.first()?.id ||
      message.mentions.members.first()?.id ||
      args[0];

      if (!someId) {
        return message.reply(
          `use \`.v\` unmute [@user/Id]\n\n example: \`.v unmute \`[${message.member}/${message.member.id}] \n\n`
        );
      }

    const exe = new ConditionsToExcute(
      message,
      !someId ? guild.id : someId,
      client
    );
    exe.commandName = "mute";
    await exe.execute(async () => {
      const { some } = await tools.checkIfRoleOrUser(guild, someId);
      someId = some;
      member.voice.channel.permissionOverwrites.edit(someId, {
        UseVAD: true,
      });

      await prefix.successfulAction(message, "Unmuted `🔇`", someId, false);
    }, "message");
  },
};
