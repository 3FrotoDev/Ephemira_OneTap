const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const client = require("../index.js");
const culda = require("../config/devs/culda.json");
const emojis = require("../config/emojis/emojis.json");
const btn_style = require("../config/emojis/buttons.json");
async function successfulAction(message, action, details) {
  await message.channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(0x42ff00)
        .setDescription(`${emojis.success} | Successfully ${action} ${details}`),
    ],
    components: [],
  });
}
async function failedAction(message, action, user) {
  await message.channel.send({
    content: `Failed To ${action} ${user}!`,
    components: [],
  });
}
async function AlreadyAction(message, action, user) {
  await message.channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(0xffd500)
        .setDescription(`${emojis.warn} | ${user} Already ${action}`),
    ],
    components: [],
  });
}

async function undefinedID(message) {
  await message.channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          `${emojis.warn} | Invalid ID`
        ),
    ],
    components: [],
  });
}
async function notInZone(message, channelId) {
  await message.channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`${emojis.warn} | You Are Not In a Voice Channel, Please Join <#${channelId}> To Create One`),
    ],
    components: [],
  });
}

async function notInRoom(message) {
  await message.channel.send({
    content: `${emojis.warn} | You Are Not In This Room!`,
    components: [],
  });
}

async function roleIsNotThere(message, roleId) {
  await message.channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          `${emojis.warn} | Insufficient Permission`
        ),
    ],
    components: [],
  });
}
//you are not the room owner
async function notTheRoomOwner(message, member) {
  await message.channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          `${emojis.warn} | ${member} You are not the owner of this room`
        ),
    ],
    components: [],
    ephemeral,
  });
}
//Action will be executed after x minutes
async function actionAfterXMinutes(message, action, minutes, ephemeral) {
  await message.channel.send({
    embeds: [
      new EmbedBuilder().setColor(0xffd500)
        .setDescription(`${emojis.typing} | Your Room Will Be **${action}**
        in : \`⏰ ${minutes}min\``),
    ],
    components: [],
    ephemeral,
  });
}
//you can do this action
async function youCanDoAction(message, action, details) {
  await message.channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(0x42ff00)
        .setDescription(`${emojis.success} | You Can ${action} ${details}`),
    ],
    components: [],
  });
}

//show details
async function showDetails(message, news, details) {
  await message.channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(0x42ff00)
        .setDescription(`${emojis.success} | ${news} ${details}`),
    ],
    components: [],
  });
}

//you can't use actions on your self
async function notYourself(message) {
  await message.channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          `${emojis.warn} | You Cannot Use This Command To Yourself`
        ),
    ],
    components: [],
  });
}
//room doeasn't have an owner
async function roomHasNoOwner(message, ...args) {
  await message.channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor("#23272A")
        .setDescription(`${emojis.success} | No One Claimed This Room`),
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
  });
}

async function roomHelp(interaction, panelroom, ephemeral) {
  const channel = await interaction.client.channels.fetch(panelroom);
  const row333 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setCustomId("xlock")
    .setEmoji("<:lock_Strides:1224144935826096229>")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("xunlock")
    .setEmoji("<:imagesremovebgpreview:1225616123970719854>")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("xhide")
    .setEmoji("<:hide_Strides:1224144887130357861>")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("xshow")
    .setEmoji("<:show_Strides:1224145017547788329>")
    .setStyle(ButtonStyle.Secondary)
);
  const ro6 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setCustomId("xonsb")
    .setEmoji("<:fum_Strides:1224144868280893552>")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("xoffsb")
    .setEmoji("<:fm_Strides:1224144860869824664>")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("xcamon")
    .setEmoji("<:camon_Strides:1224144840124530770>")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("xcamoff")
    .setEmoji("<:camoff_Strides:1224144830448537730>")
    .setStyle(ButtonStyle.Secondary)
);
  const row02 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("xname")
      .setEmoji("<:name_Strides:1224144959364665385>")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("xowner")
      .setEmoji("<:claim_Strides:1224144851306811463>")
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId("xunclaim")
      .setEmoji("<:rolepermitreject_Strides:1224144995351527466>")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("xguide")
      .setEmoji("<:limit_Strides:1224144922634883162>")
      .setStyle(ButtonStyle.Secondary)
  );
  await channel.send({
    embeds: [
      new EmbedBuilder()
      .setColor("#23272A")
      .setTitle(`${interaction.guild.name}'s Temp Voice`)
      .setURL('https://discord.gg/strides')
     
      .setDescription(`・ Make Your **Temp Channel** & Control it easily with this interface
      ・ Below is a image detailing the names of all the buttons.`)
    
      .setImage(
        "https://cdn.discordapp.com/attachments/1224446695689945198/1225642243789160569/INTERFACE.png?ex=6621df4a&is=660f6a4a&hm=04f8411a27d636dfb9428368cc27e564a075eaba61952f1037435e08dbc49ca7&"
      )
        .setFooter(culda.copyright),
    ],
    components: [row333, ro6, row02],
    ephemeral,
  });
}
//room doeasn't have an owner
async function roomHasNoOwner(message, ...args) {
  await message.channel.send({
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
  });
}
async function roomInterface(message, ephemeral) {
  const row333 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setCustomId("xlock")
    .setEmoji("<:lock:1184626278582730782>")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("xunlock")
    .setEmoji("<:unlock:1184626280658894999>")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("xhide")
    .setEmoji("<:unhide:1184753774355550309> ")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("xshow")
    .setEmoji("<:hideculda:1184753982871179376> ")
    .setStyle(ButtonStyle.Secondary)
);

  const ro6 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setCustomId("xonsb")
    .setEmoji("<:deafen:1184640655746666587> ")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("xoffsb")
    .setEmoji("<:undeafen:1184640660893081630> ")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("xcamon")
    .setEmoji("<:camera:1184625481564307526> ")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("xcamoff")
    .setEmoji("<:11846255362748088721:1211412332463263834>")
    .setStyle(ButtonStyle.Secondary)
);
  const row02 = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("xname")
      .setEmoji("<:Home:1184640583357182072> ")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("xowner")
      .setEmoji("<:user:1184628777821671474> ")
      .setStyle(ButtonStyle.Secondary),

    new ButtonBuilder()
      .setCustomId("xunclaim")
      .setEmoji("<:11846262861660160501:1211412734315593810> ")
      .setStyle(ButtonStyle.Secondary),
    new ButtonBuilder()
      .setCustomId("xguide")
      .setEmoji("<:mail:1184628774944395426> ")
      .setStyle(ButtonStyle.Secondary)
  );
  await message.channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(0x42ff00)
        .setTitle(`**List of the commands you can use:**`)
        .setURL("https://discord.gg/bemxvj3p")
        .setImage(
          "https://media.discordapp.net/attachments/1220827412548292850/1222860532663451708/help.png?ex=6617c09e&is=66054b9e&hm=c96d430505a9b3ae45dbd78822e5a9d9cfad506f7e518f2f8b970d9f8f4b216d&=&format=webp&quality=lossless"
        )
        .setFooter(culda.copyright),
    ],
    components: [row02, row333, ro6],
    ephemeral,
  });
}
//show black, white, or ban list embed
async function showList(message, list) {
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
    embed.addFields(fieldsList).setColor(0x42ff00);
  }
  await message.channel.send({
    embeds: [embed],
    components: [],
  });
}
//show only premium users can you this commands
async function onlyPremium(message) {
  await message.channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          `${emojis.warn} | Only premium users can use this Command`
        ),
    ],
    components: [],
  });
}

//subscribtion limit
async function subLimit(message) {
  await message.channel.send({
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
  });
}
//You can't use this command on room owner or manager

async function notOnOwnerOrManager(message) {
  await message.channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          `${emojis.warn} You cannot use this commands on room owner or manager`
        ),
    ],
    components: [],
  });
}
//switch help embeds based on commandname
async function switchHelpEmbed(message, command) {
  swicthEmbed = {
    reject: {
      embeds: [
        new EmbedBuilder()
          .setColor(0x42ff00)
          .setDescription(`${emojis.success} Create a room with this command`),
      ],
      components: [],
    },
    permit: {
      embeds: [
        new EmbedBuilder()
          .setColor(0x42ff00)
          .setDescription(`${emojis.success} Join a room with this command`),
      ],
      components: [],
    },
    activity: {
      embeds: [
        new EmbedBuilder()
          .setColor(0x42ff00)
          .setDescription(`${emojis.success} Leave a room with this command`),
      ],
      components: [],
    },
    blacklist: {
      embeds: [
        new EmbedBuilder()
          .setColor(0x42ff00)
          .setDescription(
            `${emojis.success} Kick a user from a room with this command`
          ),
      ],
      components: [],
    },
    ban: {
      embeds: [
        new EmbedBuilder()
          .setColor(0x42ff00)
          .setDescription(
            `${emojis.success} Ban a user from a room with this command`
          ),
      ],
      components: [],
    },
    whitelist: {
      embeds: [
        new EmbedBuilder()
          .setColor(0x42ff00)
          .setDescription(
            `${emojis.success} Unban a user from a room with this command`
          ),
      ],
      components: [],
    },
    owner: {
      embeds: [
        new EmbedBuilder()
          .setColor(0x42ff00)
          .setDescription(
            `${emojis.success} Change the room owner with this command`
          ),
      ],
      components: [],
    },
    name: {
      embeds: [
        new EmbedBuilder()
          .setColor(0x42ff00)
          .setDescription(
            `${emojis.success} Change the room name with this command`
          ),
      ],
      components: [],
    },
    info: {
      embeds: [
        new EmbedBuilder()
          .setColor(0x42ff00)
          .setDescription(
            `${emojis.success} Change the room description with this command`
          ),
      ],
      components: [],
    },
    transfer: {
      embeds: [
        new EmbedBuilder()
          .setColor(0x42ff00)
          .setDescription(`${emojis.success} Delete a room with this command`),
      ],
      components: [],
    },
    lock: {
      embeds: [
        new EmbedBuilder()
          .setColor(0x42ff00)
          .setDescription(`${emojis.success} Delete a room with this command`),
      ],
      components: [],
    },
    claim: {
      embeds: [
        new EmbedBuilder()
          .setColor(0x42ff00)
          .setDescription(`${emojis.success} Delete a room with this command`),
      ],
      components: [],
    },
    reset: {
      embeds: [
        new EmbedBuilder()
          .setColor(0x42ff00)
          .setDescription(`${emojis.success} Delete a room with this command`),
      ],
      components: [],
    },
    mute: {
      embeds: [
        new EmbedBuilder()
          .setColor(0x42ff00)
          .setDescription(`${emojis.success} Delete a room with this command`),
      ],
      components: [],
    },
    sounds: {
      embeds: [
        new EmbedBuilder()
          .setColor(0x42ff00)
          .setDescription(`${emojis.success} Delete a room with this command`),
      ],
      components: [],
    },
    cam: {
      embeds: [
        new EmbedBuilder()
          .setColor(0x42ff00)
          .setDescription(`${emojis.success} Delete a room with this command`),
      ],
      components: [],
    },
  };
  await message.channel.send(switchHelpEmbed);
}

//you can't excute command on category roles
async function notOncategoryRoles(message, op) {
  await message.channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(`${emojis.warn} You cannot use this commands on ${op}`),
    ],
    components: [],
  });
}

//you've reach your sub limit, upgrade for more
async function subLimit(message) {
  await message.channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          `${emojis.warn} You've reach your sub limit, upgrade for more`
        ),
    ],
    components: [],
  });
}

async function isNotSetupedYet(message) {
  await message.channel.send({
    embeds: [
      new EmbedBuilder()
        .setColor(0xff0000)
        .setDescription(
          "You need to setup your bot with this command: </set-onetap:1148609957311299645>"
        ),
    ],
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
  isNotSetupedYet,
  roomHelp,
  roomInterface,
};
