const {
  InteractionType,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const fs = require("fs");
const { prefix } = process.env;
const emojis = require("../../config/emojis/emojis.json");
const { getState } = require("../../libs/engines/guildChecker");
const { isCuldaDev } = require("../../libs/tools");

module.exports = (client) => {
  client.handleRules = async () => {
    const ruleFolders = fs.readdirSync("./src/rules");
    for (const folder of ruleFolders) {
      const ruleFiles = fs
        .readdirSync(`./src/rules/${folder}`)
        .filter((file) => file.endsWith(".js"));
      const { rules } = client;
      for (const file of ruleFiles) {
        const rule = require(`../../rules/${folder}/${file}`);
        rules.set(rule.data.name, rule);
        console.log(`Rules: ${rule.data.name} has loaded.`);
      }
      console.log(`Successfully reloaded prefix (${prefix}) rules.`);
    }

    client.on("messageCreate", async (message) => {
      const { content, channel, member, guild } = message;
      if (content.startsWith(prefix)) {
        const args = content.slice(prefix.length).trim().split(" ");
        const ruleName = args.shift().toLowerCase();
        const rule = client.rules.get(ruleName);
        if (!rule) {
          message.delete();
          const sendMessage = await channel.send({
            content: `<@${member.id}>`,
            embeds: [
              new EmbedBuilder()
                .setColor(0xff0000)
                .setDescription("This Command is incorrect or doesn't exist!"),
            ],
          });
          setTimeout(() => {
            sendMessage.delete();
          }, 20000);
        } else {
          if (guild) {
            let isWhiteListed = getState(guild.id);
            if (!(isWhiteListed || isCuldaDev(member.id))) {
              await message.channel.sendTyping();
              const Embed = new EmbedBuilder()
                .setColor("#0cf317")
                .setDescription(`This All Prime Commands In Culda Studio`);
              const Row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                  .setURL(`https://discord.gg/culda`)
                  .setStyle(ButtonStyle.Link)
                  .setLabel(`Culda Studio`)
                  .setEmoji(emojis.ping)
              );
              message.delete();
              return await channel.send({ embeds: [Embed], components: [Row] });
            }
            // Assuming 'interaction' is the interaction object
            const botMember = await guild.members.cache.get(client.user.id);
            if (!botMember.permissions.has(PermissionFlagsBits.Administrator))
              return await message.reply({
                content: `${emojis.warn} I don't have the permission to do this action.`,
              });
          }
          await channel.sendTyping();
          await rule.execute( message, args, client);
        }
      }
    });
  };
};
