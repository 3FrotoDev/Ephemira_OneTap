const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");


const { getSetup, getBwbList } = require("../../libs/engines/engine.js");
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
    name: "cam",
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
            Stream: true,
          });
          await prefix.successfulAction(
            message,
            "Enabled video sharing for ",
            mention,
            false
          );
        }else if(banType == "off") {
       
 await member.voice.channel.permissionOverwrites.edit(someId, {
            Stream: false,
          });
          await member.voice.channel.permissionOverwrites.edit(
            getOwnerByRoomId(guild.id, member.voice.channel.id),
            { Stream: true }
          );
        
          getManagersList(guild.id,member.voice.channel.id).forEach(async (uid) => {
            const u = await guild.members.cache.get(uid);
            if (u) {
              await member.voice.channel.permissionOverwrites.edit(u.id, {
                Stream: true,
              });
            }
          });
          await prefix.successfulAction(
            message,
            "Disabled video sharing for ",
            mention,
            false
          );


        }
      }, "message");
    } else {
      // reply use prefix + ban [add/remove/show]
      await message.reply(
        `use \`.v\` cam [on/off] \n\n example: \`.v cam off @user\` \n\n`,
      );
    }
  },
};