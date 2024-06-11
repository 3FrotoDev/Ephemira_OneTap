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
    name: "mute",
  },
  async execute(message, args, client) {
    const { guild, member, channel } = message;

    let someId =
      message.mentions.roles.first()?.id ||
      message.mentions.members.first()?.id ||
      args[0];

    // Check if someId is undefined or null
    if (!someId) {
      return message.reply(
        `use \`.v\` mute [@user/Id]\n\n example: \`.v mute \`[${message.member}/${message.member.id}] \n\n`
      );
    }

    const exe = new ConditionsToExcute(
      message,
      someId,
      client
    );
    exe.commandName = "mute";
    await exe.execute(async () => {
      const { some } = await tools.checkIfRoleOrUser(guild,someId);
      someId = some;
      member.voice.channel.permissionOverwrites.edit(someId, {
        UseVAD: false
      });
      member.voice.channel.permissionOverwrites.edit(
        getOwnerByRoomId(guild.id, member.voice.channel.id),
        {  UseVAD: true }
      );
      getManagersList(guild.id, member.voice.channel.id).forEach(
        async (uid) => {
          const u = await guild.members.cache.get(uid);
          if (u) {
            member.voice.channel.permissionOverwrites.edit(u.id, {
              UseVAD: true
            });
          }
        }
      );
      await prefix.successfulAction(message, "Muted `🔇`", someId, false);
    }, "message");
  },
};
