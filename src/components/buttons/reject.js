const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} = require("discord.js");

const tools = require("../../libs/tools.js");
const emojis = require("../../config/emojis/emojis.json");
const embeds = require("../../embeds/index.js");
const {
  getSetup,
  getManagersList,
  getOwnerByRoomId,
} = require("../../libs/engines/engine.js");
const { ConditionsToExcute } = require("../../libs/engines/classes.js");

module.exports = {
  data: {
    name: "xreject",
  },
  async execute(interaction, client) {
    await interaction.deferReply();

    const { guild, member, channel } = interaction;
    //user claims the room after he clicks
    const exe = new ConditionsToExcute(interaction, null, client);
    // disactive conditions
    exe.invalid = false;
    exe.premium = false;
    exe.execute(async () => {
      const memberList = (some) => {
        if(!some.voice.channel) return [];
        return some.voice.channel.members.map((m) => {
            if (some.id == m.id ||
              getOwnerByRoomId(guild.id, some.voice.channel.id) == m.id ||
              m.user.bot || (getManagersList(guild.id, some.voice.channel.id).includes(some.id) && getManagersList(guild.id, some.voice.channel.id).includes(m.id))) return;
            return {
              label: `${m.displayname || m.user.username}`,
              value: `${m.id}`,
              description: `original name: ${m.user.username}`,
              emoji: getManagersList(guild.id, some.voice.channel.id).includes(m.id) ? "⚙" : "🙎‍♂️",};
          })
          .filter((e) => e != undefined && !tools.isCuldaDev(e.value) );
      };
      
      const membersId = memberList(member);
      if (membersId.length > 0) {
        const embed = "";

        const row = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("mreject")
            .setPlaceholder("Select Users To Reject")
            .setMaxValues(membersId.length)
            .addOptions(membersId)
        );
        await interaction.editReply({ components: [row] }).then((msg) => {
            client.messageOwner.set(msg.id,member.id);
          let oldMembersList = msg.channel.members.map(k=>k.id);
          let x = setInterval(async () => {
            const membersList = memberList(member);
            const newMembersList = member.voice.channel.members.map(k=>k.id);

            if ( JSON.stringify(newMembersList) != JSON.stringify(oldMembersList) ) {
              oldMembersList = msg.channel.members.map(k=>k.id);
              const row1 = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                  .setCustomId("mreject")
                  .setPlaceholder("Select Users To Reject")
                  .setMaxValues(membersList.length)
                  .addOptions(membersList)
              );
              await msg.edit({components: [row1] }).catch((e) => null);
            }
          }, 1000);
          setTimeout(async () => {
            client.messageOwner.delete(msg.id);
            clearInterval(x);
            await msg.delete().catch((e) => null);
          }, 1000 * 20);
        });
      } else {
        await interaction.editReply({ content: "No One To Reject!" });
      }
    });
  },
};
