const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} = require("discord.js");
const ms = require("ms");

const tools = require("../../libs/tools.js");

module.exports = {
  data: {
    name: "ping",
  },
  async execute(message, args, client) {
    const startTime = Date.now();
    await message.channel.sendTyping();
    const { guild, member, channel } = message;
    const ping = Math.round(message.client.ws.ping);
    const pings = ms(Date.now() - client.ws.shards.first().lastPingTimestamp, {long: true,});
    let totalSeconds = client.uptime / 1000;
    let days = Math.floor(totalSeconds / 86400);
    totalSeconds %= 86400;
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);
    let uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
    // time res:
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    const pingEmbed = new EmbedBuilder()
      .setTitle("Bot Stats")
      .setColor("#0cf317")
      .setDescription(`**🏓 |API latency:**   \`${ping}\`ms 🛰️,
      **🎯 |Last heartbeat calculated ago:**   \`${pings}\`,
      **⏲️ |Response time:** \`${responseTime}\`ms,
      **🟢 |Uptime Stats:** \`\`\`+ Status : Online\n+ ${uptime}\`\`\`
          `);
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setLabel(`Ping:${ping}ms`)
        .setCustomId("yony")
        .setEmoji("<:stats:1222737683386994720>")
        .setDisabled(true)
    );
    await message.channel.send({ embeds: [pingEmbed], components: [row] });
  },
};
