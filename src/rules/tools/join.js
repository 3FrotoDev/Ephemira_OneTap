const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} = require("discord.js");
const { joinVoiceChannel } = require("@discordjs/voice");
const emojis = require("../../config/emojis/emojis.json");
const tools = require("../../libs/tools.js");

module.exports = {
  data: {
    name: "join",
    description: "Joins the voice channel.",
  },
  async execute(message, args, client) {
    await message.channel.sendTyping();
    const { guild, member, channel } = message;
    const roomTag = args[0];
    const roomId = roomTag ? roomTag.replace(/[^0-9]/g, "") : roomTag;
        let room = await guild.channels.cache.get(roomId);
        if (!room) {
          if (member.voice.channel) {
            room = member.voice.channel;
          } else {
            room = null;
          }
        }

        if (room) {
          let connection = joinVoiceChannel({
            channelId: room.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
          });
          if (connection) {
            // here when the bot joins.
            const join = new EmbedBuilder()
              .setDescription(`Joined voice channel <#${room.id}>`)
              .setColor("#0cf317");
            await message.reply({ embeds: [join] });
          } else {
            // here when the bot throw error.
            await message.reply(
              "There was an error joining the voice channel."
            );
          }
        } else {
          await message.reply("No room existed.");
        }
      
    
  },
};
