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
const tools = require("../../libs/tools.js");
const {
  getOwnerByRoomId,
  addManager,
  removeManager,
  getManagersList,
} = require("../../libs/engines/engine.js");
module.exports = {
  data: {
    name: "hide",
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
        ViewChannel: false,
      });
      await member.voice.channel.permissionOverwrites.edit(
        getOwnerByRoomId(guild.id, member.voice.channel.id),
        { ViewChannel: true }
      );

      getManagersList(guild.id,member.voice.channel.id).forEach(async (uid) => {
        const u = await guild.members.cache.get(uid);
        if (u) {
          await member.voice.channel.permissionOverwrites.edit(u.id, {
            ViewChannel: true,
          });
        }
      });
      await prefix.successfulAction(
        message,
        "Hided your channel from ",
        mention,
        false
      );
    },"message"); // 
  },
};
