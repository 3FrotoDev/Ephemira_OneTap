const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

const culda = require("../../config/devs/culda.json");

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
      name: "help",
    },
    async execute(message, args, client) {
    const { guild, member, channel } = message;
  const commandName = args.join(", ");
  if(!commandName){
    const select = new StringSelectMenuBuilder()
    .setCustomId('starter')
    .setPlaceholder('Select a Category')
    .addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel('Voice Commands')
        .setDescription('To View All The Voice-Related Commands')
        .setEmoji('<:gold_voice:1226289968557588561>')
        .setValue('bulbasaur'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Setup Commands')
        .setDescription('To View All The Setup-Related Commands')
        .setEmoji('<:Role_Expert:1224191442910707782>')
        .setValue('charmander'),
      new StringSelectMenuOptionBuilder()
        .setLabel('Admins Commands')
        .setDescription('To View All The Admins-Related Commands')
        .setEmoji('<:staff_team:1224191450930085939>')
        .setValue('squirtle'),
    );

  const row1 = new ActionRowBuilder()
    .addComponents(select);

              const ppEmbed = new EmbedBuilder()
              .setColor(0x4a89bd)
              .setTitle(`Ephemira's Help Panel`)
              .setDescription('Hey, New Here? Im **Ephemira**, Im a **Discord Bot** that creates temporary voice channels, If you dont know how to use me please Click the menu below to view all my commands\n\n<:20220605_193555:1226234390955163700> **My Prefix** : Slash Commands | `.v`\n<:20220605_193555:1226234390955163700> **Support Server** : [Click Here](https://discord.gg/strides)\n<:20220605_193555:1226234390955163700> **Vote For Me** : [Click Here](https://top.gg/soon)')
              .setImage('https://cdn.discordapp.com/attachments/1224446695689945198/1224494257402941481/Ephemirabanner.png?ex=661db224&is=660b3d24&hm=75b8f07cb64c3290f982ebaf783cd6cb7ec5746b64064d38c68ecbddc57d0659&')
              .setThumbnail(message.guild.iconURL({ dynamic: true, size: 4096 }))
              .setFooter(culda.copyright)
              .setTimestamp()

  
  
              
  
              message.reply({ embeds: [ppEmbed], components: [row1] });
  }
   else {
    //something went wrong try using /help
    await message.channel.send({
      embeds: [
        new EmbedBuilder()
          .setColor(0xff0000)
          .setDescription(
            `You made a mistake, TRY : \`/help\` or \`.v\`help`
          ),
      ],
      components: [],
    })
  }
  },
};
