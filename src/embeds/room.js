const emojis = require("../config/emojis/emojis.json");
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const culda = require("../config/devs/culda.json");
async function successfulAction(interaction, action, details, ephemeral) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor('#e24e4e')
        .setDescription(`${emojis.success} | Sucessfully ${action} ${details}`),
    ],
    components: [],
    ephemeral,
  });
}

async function failedAction(interaction, action, user, ephemeral) {
  await interaction.editReply({
    content: `${emojis.warn} | Failed to ${action} To ${user}`,
    components: [],
    ephemeral,
  });
}

async function AlreadyAction(interaction, action, user, ephemeral) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0xffd500)
        .setDescription(`${emojis.warn} | ${user} ${action} `),
    ],
    components: [],
    ephemeral,
  });
}

async function undefinedID(interaction, ephemeral) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          `${emojis.warn} | The ID that you have entered is not valid`
        ),
    ],
    components: [],
    ephemeral,
  });
}
async function notInZone(interaction, channelId, ephemeral) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`${emojis.warn} |  You Are Not In a Voice Channel, Please Join <#${channelId}> To Create One`),
    ],
    components: [],
    ephemeral,
  });
}

async function notInRoom(interaction, ephemeral) {
  await interaction.editReply({
    content: `${emojis.warn} | You are not in this room!`,
    components: [],
    ephemeral,
  });
}

async function roleIsNotThere(interaction, roleId, ephemeral) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          `${emojis.warn} | You Need to have <@&${roleId}> to use this command`
        ),
    ],
    components: [],
    ephemeral,
  });
}
//you are not the room owner
async function notTheRoomOwner(interaction, ephemeral, member) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`${emojis.warn} | ${member} You are not the room owner`),
    ],
    components: [],
    ephemeral,
  });
}
//Action will be executed after x minutes
async function actionAfterXMinutes(
  interaction,
  action,
  minutes,
  name,
  ephemeral
) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder().setColor(0xffd500)
        .setDescription(`${emojis.typing} |  Your room will be **${action}** : \`\`\`${name}\`\`\`
        in : \`⏰ ${minutes}\``),
    ],
    components: [],
    ephemeral,
  });
}
//you can do this action
async function youCanDoAction(interaction, action, details, ephemeral) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor('#e24e4e')
        .setDescription(`${emojis.success} | You can ${action} ${details}`),
    ],
    components: [],
    ephemeral,
  });
}

//show details
async function showDetails(interaction, news, details, ephemeral) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor('#e24e4e')
        .setDescription(`${emojis.success} | ${news} ${details}`),
    ],
    components: [],
    ephemeral,
  });
}

//you can't use actions on your self
async function notYourself(interaction, ephemeral) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          `${emojis.warn} | You cannot use this commands on yourself`
        ),
    ],
    components: [],
    ephemeral,
  });
}
//room doeasn't have an owner
async function roomHasNoOwner(interaction, ephemeral, ...args) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0xffff00)
        .setDescription(`${emojis.success} | This room has no owner`),
    ],
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Claim Room")
          .setStyle(ButtonStyle.Primary)
          .setCustomId("claim-room")
          .setEmoji("✅")
          .setDisabled(args[0] ? args[0] : false)
      ),
    ],
    ephemeral,
  });
}

//show black, white, or ban list embed
async function showList(interaction, list, ephemeral) {
  const embed = new EmbedBuilder();
  let fieldsList = [];
  // Display roles on top];
  if (list.length == 0) {
    embed.setDescription(`😨 No one yet.`).setColor(0xebb734);
  } else {
    if (list.some((m) => m.type == "role")) {
      fieldsList.push({
        name: "Roles:",
        value: list
          .map((m) => {
            if (m.type == "role") return `${m.mention}\n`;
          })
          .join(""),
      });
    }

    if (list.some((m) => m.type == "user"))
      fieldsList.push({
        name: "Users:",
        value: list
          .map((m) => {
            if (m.type == "user") return `${m.mention}\n`;
          })
          .join(""),
      });
    embed.addFields(fieldsList).setColor('#e24e4e');
  }

  await interaction.editReply({
    embeds: [embed],
    components: [],
    ephemeral,
  });
}

//show only premium users can you this commands
async function onlyPremium(interaction, command, ephemeral) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          `${emojis.warn} Only premium users can use this Command`
        ),
    ],
    components: [],
    ephemeral,
  });
}
//subscribtion limit
async function subLimit(interaction, ephemeral) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          `${emojis.crown} You have reached your subscribtion limit\nUpgrade to Premium for more`
        ),
    ],
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Upgrade Now")
          .setStyle(ButtonStyle.Secondary)
          .setCustomId("upgrade")
          .setEmoji("👑")
          .setDisabled(args[0] ? args[0] : false)
      ),
    ],
    ephemeral,
  });
}
//You can't use this command on room owner or manager

async function notOnOwnerOrManager(interaction, ephemeral) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          `${emojis.warn} You cannot use this commands on room owner or manager`
        ),
    ],
    components: [],
    ephemeral,
  });
}
//switch help embeds based on commandname
async function switchHelpEmbed(interaction, command, ephemeral) {
  const swicthEmbed = {
    reject: {
      embeds: [
        new EmbedBuilder().setColor('#e24e4e')
          .setDescription(`${emojis.success} You can kick Anyone from your room: \n
        Select: Users , Roles, or Everyone on your room,\n
        use \`.v\`reject \`@user | @role | everyone\` and add your target\n
        Example: \`.v\`reject on @user\` or \`.v\`reject @everyone\`\n
        You can also use Slash Commands \n
        Example: \`/reject @user\` or \`/reject @everyone\``),
      ],
      components: [],
      ephemeral,
    },
    permit: {
      embeds: [
        new EmbedBuilder().setColor('#e24e4e')
          .setDescription(`${emojis.success} You can Give access to your room: \n
        Select: Users , Roles, or Everyone on your room,\n
        use \`.v\`permit \`@user | @role | everyone\` and add your target\n
        Example: \`.v\`permit on @user\` or \`.v\`permit @everyone\`\n
        You can also use Slash Commands \n
        Example: \`/permit @user\` or \`/permit @everyone\``),
      ],
      components: [],
      ephemeral,
    },
    activity: {
      embeds: [
        new EmbedBuilder().setColor('#e24e4e')
          .setDescription(`${emojis.success} You can enable or disable the Activities for : \n
        Users , Roles, or for Everyone on your room,\n
        use \`.v\`Activity \`off|on\` and add your target\n
        Example: \`.v\`Activity on @user\` or \`.v\`Activity off everyone\`\n
        You can also use Slash Commands \n
        Example: \`/Activity on @user\` or \`/Activity off everyone\`
         `),
      ],
      components: [],
      ephemeral,
    },
    blacklist: {
      embeds: [
        new EmbedBuilder().setColor('#e24e4e')
          .setDescription(`${emojis.success} You can Remove access forever: \n
        to: Users , Roles,  your room,\n
        use \`.v\`bl add|remove \`and add your target \`@user | @role\`
        Example: \`.v\`bl on @user\` or \`.v\`bl @everyone\`\n
        You can also use Slash Commands \n
        Example: \`/bl add @user\` or \`/bl remove @role\`\n
        To show your blacklist use \`.v\`bl show`),
      ],
      components: [],
      ephemeral,
    },
    ban: {
      embeds: [
        new EmbedBuilder().setColor('#e24e4e')
          .setDescription(`${emojis.success} You can hide & Remove access forever: \n
        to: Users , Roles, from your room,\n
        use \`.v\`ban add|remove \`and \n
        add your target \`@user | @role\`\n
        Example: \`.v\`ban remove @user\` or \`.v\`ban add @role\`\n
        You can also use Slash Commands \n
        Example: \`/ban add @user\` or \`/ban remove @role\`\n
        To show your banacklist use \`.v\`ban show`),
      ],
      components: [],
      ephemeral,
    },
    whitelist: {
      embeds: [
        new EmbedBuilder().setColor('#e24e4e')
          .setDescription(`${emojis.success} You can Remove access forever: \n
        Select from Users or Roles, \n
        use \`.v\`wl add|remove \`and \n
        add your target \`@user | @role\`\n
        Example: \`.v\`wl remove @user\` or \`.v\`wl add @role\`\n
        You can also use Slash Commands \n
        Example: \`/wl add @user\` or \`/wl remove @role\`\n
        To show your banacklist use \`.v\`wl show`),
      ],
      components: [],
      ephemeral,
    },
    owner: {
      embeds: [
        new EmbedBuilder().setColor('#e24e4e').setDescription(
          `${emojis.success} You can see the owner a specific room\n
          Start with the command and add the @channel\n
          Example: \`.v\`owner\` @channel\n
          !remember that @channel is not required\n
          To see the owner of the room use \`.v\`owner\` without arguments\n
          To change the owner use \`.v\`owner \`@user\``
        ),
      ],
      components: [],
      ephemeral,
    },
    name: {
      embeds: [
        new EmbedBuilder().setColor('#e24e4e')
          .setDescription(`${emojis.success} Set a Custom name to your room\n
        Start with the command and add the @channel\n
        Example: \`.v\`name\` @channel\n
        !remember that @channel is not required\n
        To see the name of the room use \`.v\`name\` without arguments\n
        To change the name use \`.v\`name \`@user\``),
      ],
      components: [],
      ephemeral,
    },
    info: {
      embeds: [
        new EmbedBuilder().setColor('#e24e4e')
          .setDescription(`${emojis.success} See information about the room : \n
        like : Users , Roles, or Everyone Permissions,\n
        use \`.v\`info \`off|on\` and add your target\n
        Example: \`.v\`info\n
        You can also use Slash Commands \n
        Example: \`/info\``),
      ],
      components: [],
      ephemeral,
    },
    transfer: {
      embeds: [
        new EmbedBuilder().setColor('#e24e4e')
          .setDescription(`${emojis.success} You can enable or disable the Activities for : \n
        Users , Roles, or for Everyone on your room,\n
        use \`.v\`Activity \`off|on\` and add your target\n
        Example: \`.v\`Activity on @user\` or \`.v\`Activity off everyone\`\n
        You can also use Slash Commands \n
        Example: \`/Activity on @user\` or \`/Activity off everyone\`
         `),
      ],
      components: [],
      ephemeral,
    },
    lock: {
      embeds: [
        new EmbedBuilder().setColor('#e24e4e')
          .setDescription(`${emojis.success} You can Block acces to your room : \n
        Everyone will not be able to connect toyour room,\n
        use \`.v\`lock command to enable it\n
        or the new slash command \`/lock\`\n
        to give access back to everyone use \`/unlock\` or \`.v\`unlock
        or use \`.v\`permit command for a specific user\n
        Example: \`.v\`permit @user\` or \`.v\`permit @role\``),
      ],
      components: [],
      ephemeral,
    },
    claim: {
      embeds: [
        new EmbedBuilder().setColor('#e24e4e')
          .setDescription(`${emojis.success} Claim the room and be the new King,\n
        use \`.v\`claim command to enable it\n
        or the new slash command \`/claim\`\n
        if you want to release the room for anyone to claim\n
        use \`/unclaim\` or \`.v\`unclaim
         `),
      ],
      components: [],
      ephemeral,
    },
    reset: {
      embeds: [
        new EmbedBuilder().setColor('#e24e4e')
          .setDescription(`${emojis.success} Use reset to clean the channel permissions\n
        Use \`.v\`reset\` to reset the channel permissions\n
        if you are a prime user you can use \`.v\`reset\` to reset the channel permissions\n
        Example: \`.v\`reset\` fro your currrent channel\n
        or \`.v\`reset\`all to reset all the settings
         `),
      ],
      components: [],
      ephemeral,
    },
    mute: {
      embeds: [
        new EmbedBuilder().setColor('#e24e4e')
          .setDescription(`${emojis.success} You can Mute or Unmute : \n
        Users , Roles, or Everyone on your room,\n
        use \`.v\`mute \`off|on\` and add your target\n
        Example: \`.v\`mute on @user\` or \`.v\`mute off everyone\`\n
        You can also use Slash Commands \n
        Example: \`/mute on @user\` or \`/mute off everyone\`
         `),
      ],
      components: [],
      ephemeral,
    },
    sounds: {
      embeds: [
        new EmbedBuilder().setColor('#e24e4e')
          .setDescription(`${emojis.success} You can enable or disable the Soundboard for : \n
        Users , Roles, or Everyone on your room,\n
        use \`.v\`sb \`off|on\` and add your target\n
        Example: \`.v\`sb on @user\` or \`.v\`sb off everyone\`\n
        You can also use Slash Commands \n
        Example: \`/sounds on @user\` or \`/sounds off everyone\`
         `),
      ],
      components: [],
      ephemeral,
    },
    cam: {
      embeds: [
        new EmbedBuilder().setColor('#e24e4e')
          .setDescription(`${emojis.success} You can enable or disable the cam and stream for : \n
        Users , Roles, or Everyone on your room,\n
        use \`.v\`cam \`off|on\` and add your target\n
        Example: \`.v\`cam on @user\` or \`.v\`cam off everyone\`\n
        You can also use Slash Commands \n
        Example: \`/cam on @user\` or \`/cam off everyone\`
         `),
      ],
      components: [],
      ephemeral,
    },
  };
  if (swicthEmbed.hasOwnProperty(command)) {
    await interaction.editReply(swicthEmbed[command]);
  } else {
    console.error(`Command ${command} does not exist in switchEmbed object.`);
  }
}
//you can't excute command on category roles
async function notOncategoryRoles(interaction, op, ephemeral) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`${emojis.warn} You cannot use this commands on ${op}`),
    ],
    components: [],
    ephemeral,
  });
}

//you've reach your sub limit, upgrade for more
async function subLimit(interaction, ephemeral) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          `${emojis.warn} You've reach your sub limit, upgrade for more`
        ),
    ],
    components: [],
    ephemeral,
  });
}

//room help embed that shows the users the commands available for him to use

async function roomHelp(interaction, ephemeral) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor('#e24e4e')
        .setAuthor({
          name: interaction.user.username,
          iconURL: interaction.user.avatarURL(),
          url: `https://discord.gg/culda`,
        })
        .setTitle(`**List of the commands you can use:**`)
        .setDescription(
          `<a:cant:1208883551924396114>  \`.v\` **invite** :\` invite a use to join the room\`
          <a:cant:1208883551924396114>  \`.v\` **reject** : \`kick a user from the room\`
          <a:cant:1208883551924396114>  \`.v\` **lock** : \`lock the room\`
          <a:cant:1208883551924396114>  \`.v\` **unlock** : \`unlock the room\`
          <a:cant:1208883551924396114>  \`.v\` **permit** :\` permit a user to join the room\`
          <a:cant:1208883551924396114>  \`.v\` **transfer** : \`enable or disable the Activities\`
          <a:cant:1208883551924396114>  \`.v\` **cam** :\` on or of for the room\`
          <a:cant:1208883551924396114>  \`.v\` **name** : \`name your channel\`
          <a:cant:1208883551924396114>  \`.v\` **mute** \`:Disable or enable speak for users\`
          <a:cant:1208883551924396114>  \`.v\` **claim** : \`take room when no is looking!\`
          <a:cant:1208883551924396114>  \`.v\` **show** : \`show the details of the room\`
          <a:cant:1208883551924396114> \`.v\` **help** : \`show the list of the commands\`
      `
        )
        .setImage(
          "https://images-ext-2.discordapp.net/external/Uk1B_Y8vz-cgWgbaf5_UJ8cIqW8FfP7HUSo60AS5uu8/%3Fwidth%3D400%26height%3D241/https/images-ext-1.discordapp.net/external/DoyExbHSnUyCHCiqHU4Xf7jAkiC2bwUBsnr6McI0FfI/%253Fsize%253D1024/https/cdn.discordapp.com/banners/1206567770850857010/a_b2a5e61d045c02df46ceb8881b47cc16.gif"
        )
        .setFooter(culda.copyright),
    ],
    components: [],
    ephemeral,
  });
}

async function isNotSetupedYet(interaction, ephemeral) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          "You need to setup your bot with this command: </set-onetap:1148609957311299645>"
        ),
    ],
    ephemeral,
  });
}

async function premiumBot(interaction, ephemeral) {
  await interaction.editReply({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription("You need to buy premium to use this command"),
    ],
    components: [],
    ephemeral,
  });
}
module.exports = {
  successfulAction,
  failedAction,
  AlreadyAction,
  undefinedID,
  notInRoom,
  roleIsNotThere,
  notTheRoomOwner,
  actionAfterXMinutes,
  notInZone,
  youCanDoAction,
  showDetails,
  notYourself,
  roomHasNoOwner,
  showList,
  onlyPremium,
  subLimit,
  switchHelpEmbed,
  notOnOwnerOrManager,
  notOncategoryRoles,
  subLimit,
  switchHelpEmbed,
  roomHelp,
  isNotSetupedYet,
  premiumBot,
};
