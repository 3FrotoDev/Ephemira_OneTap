const { EmbedBuilder, PermissionsBitField  } = require("discord.js");
const fs = require("fs");
const { getState } = require("../../libs/engines/guildChecker");
const { isCuldaDev } = require("../../libs/tools");
const emojis = require("../../config/emojis/emojis.json");
module.exports = (client) => {
  client.handleUtils = async () => {
    const utilFolders = fs.readdirSync("./src/utils");
    for (const folder of utilFolders) {
      const utilFiles = fs
        .readdirSync(`./src/utils/${folder}`)
        .filter((file) => file.endsWith(".js"));
      const { utils } = client;
      for (const file of utilFiles) {
        const util = require(`../../utils/${folder}/${file}`);
        utils.set(util.data.name, util);
        for (const alias of util.data.aliases) {
          utils.set(alias, util);
        }
        console.log(`Utils: ${util.data.name} has loaded. `);
      }
      console.log(`Successfully Reloaded All Utils.`);
    }
    return; // Added return statement
  };

  client.on("messageCreate", async (message) => {
    const { content, channel, member, guild } = message;
    const args = content.trim().split(" ");
    const utilName = args.shift();
    const util = client.utils.get(utilName);
    if (util) {
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
          return await channel.send({ embeds: [Embed], components: [Row] }); // Added return statement
        }

        // Assuming 'interaction' is the interaction object
        const botMember = await guild.members.cache.get(client.user.id);
        if (!botMember.permissions.has(PermissionsBitField.Flags.Administrator))
          return await message.reply({
            content: `${emojis.warn} I don't have the permission to do this action.`,
          });
      }

      await channel.sendTyping();
      await util.execute(message, args, client);
    }
  });
};
