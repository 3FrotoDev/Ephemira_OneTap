const {
  ChannelType,
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
} = require("discord.js");

const btn_style = require("../config/emojis/buttons.json");

const CULDA = require("../config/devs/culda.json");
const DEVS = require("../config/devs/users.json");
const embeds = require("../embeds/index.js");
const prefix = require("../embeds/prefix.js");
const culda = require("../config/devs/culda.json");
const { getType } = require("./engines/guildChecker.js");
const {
  createRoom,
  deleteRoom,
  isParentHasOneTap,
  getOwnerByRoomId,
  setOwnerByRoomId,
  whoIsOwnerOfThisRoom,
  setUserValueById,
  getBwbList,
  getPremiumRole,
  countBwbList,
  bwbList,
  resetManagersOfRoom,
  getSetup,
  getUserValueById,
  transferUserFromList,
} = require("./engines/engine.js");

function isCuldaDev(userId) {
  return DEVS[userId] ? true : false;
}

async function haveYouBoostedOurServer(client, member) {
  const guild = await client.guilds.cache.get(CULDA.guildId);
  const user = await guild.members.cache.get(member.id);
  let isBoosted = false;
  if (user) {
    if (user.roles.cache.has(CULDA.boostRoleId)) {
      isBoosted = true;
    }
  }
  return isBoosted;
}

function getDateFromId(id) {
  //split every two characters
  let arr = id.match(/.{1,2}/g);
  let year = arr.splice(0, 2).join("");
  let month = arr.splice(0, 1).join("");
  let day = arr.splice(0, 1).join("");
  let hour = arr.splice(0, 1).join("");
  let minute = arr.splice(0, 1).join("");
  let second = arr.splice(0, 1).join("");
  //convert the terms into numbers, noting that JS months are 0-indexed
  return new Date(+year, +month - 1, +day, +hour, +minute, +second);
}

function formatDate(format, date = new Date()) {
  let hours = String(date.getHours()).padStart(2, "0");
  let minutes = String(date.getMinutes()).padStart(2, "0");
  let seconds = String(date.getSeconds()).padStart(2, "0");
  let day = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = date.getFullYear();
  let replace = {
    YY: year,
    MM: month,
    dd: day,
    hh: hours,
    mm: minutes,
    ss: seconds,
  };
  for (let key in replace) {
    format = format.replace(key, replace[key]);
  }
  return format;
}

///////////////////[FUNCTIONS OneTap]//////////////////////

async function createRoomFromParent(guild, member, parentId) {
  const name = getUserValueById(guild.id, member.id, "name");
  const voiceChannel = await guild.channels.create({
    name: `${name ? name : member.displayName}`,
    type: ChannelType.GuildVoice,
    parent: parentId,
    userLimit: 99,
  });
  createRoom(guild.id, voiceChannel.id, member.id, parentId);
  setUserValueById(guild.id, member.id, "roomId", voiceChannel.id);
  setBwbListInChannel(guild, member, voiceChannel);
  let ownerRole = getSetup(guild.id)["roomOwnerRole"];
  if (ownerRole) await member.roles.add(ownerRole);

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

  await voiceChannel.send({
    embeds: [
      new EmbedBuilder()
        .setColor("#23272A")

        .setColor("#23272A")
      .setTitle(`${member.user.username}'s Temp Voice`)
      .setURL('https://discord.gg/strides')
      .setDescription(`・ Welcome To Your **Temp Channel**, Control it easily with this interface
      ・ Below is a image detailing the names of all the buttons.`)

        .setImage(
          "https://cdn.discordapp.com/attachments/1224446695689945198/1225642243789160569/INTERFACE.png?ex=6621df4a&is=660f6a4a&hm=04f8411a27d636dfb9428368cc27e564a075eaba61952f1037435e08dbc49ca7&"
        )
        .setFooter(culda.copyright),
    ],

    //lock unlock owner name
    content: `Welcome To Your Channel [<@${member.id}>]`,
    components: [row333, ro6, row02],
  });
  return voiceChannel;
}

async function deleteRoomFromParent(guild, room) {
  if (room) {
    // console.log(room.id);
    let member = await guild.members.cache.get(
      whoIsOwnerOfThisRoom(guild.id, room.id)
    );
    deleteRoom(guild.id, room.id);
    await room.delete();
    if (member) {
      setUserValueById(guild.id, member.id, "roomId", null);
      let ownerRole = getSetup(guild.id)["roomOwnerRole"];
      if (ownerRole) await member.roles.remove(ownerRole);
    }
    // console.log("Room deleted");
  }
}
function handleButtonClick(interaction) {
  // Get the custom ID of the button that was clicked.
  const customId = interaction.customId;
  let clickCount = 0;
  // Switch on the custom ID to determine which button was clicked.
  switch (customId) {
    case "xunlock":
      clickCount++;
      if (clickCount > 2) {
        interaction.message.components[0].components[0].disable(true);
      }
      break;
    case "xlock":
      clickCount++;
      if (clickCount > 2) {
        interaction.message.components[0].components[0].disable(true);
      }
      break;
    case "xowner":
      clickCount++;
      if (clickCount > 2) {
        interaction.message.components[0].components[1].disable(true);
      }
      break;
    case "xname":
      clickCount++;
      if (clickCount > 2) {
        interaction.message.components[0].components[2].disable(true);
      }
      break;
    case "xshow":
      clickCount++;
      if (clickCount > 2) {
        interaction.message.components[1].components[0].disable(true);
      }
      break;
    case "xhide":
      clickCount++;
      if (clickCount > 2) {
        interaction.message.components[1].components[1].disable(true);
      }
      break;
    case "xonsb":
      clickCount++;
      if (clickCount > 2) {
        interaction.message.components[1].components[2].disable(true);
      }
      break;
    case "xoffsb":
      clickCount++;
      if (clickCount > 2) {
        interaction.message.components[1].components[3].disable(true);
      }
      break;
    case "xhelp":
      clickCount++;
      if (clickCount > 2) {
        interaction.message.components[2].components[0].disable(true);
      }
      break;
    case "xcamon":
      clickCount++;
      if (clickCount > 2) {
        interaction.message.components[2].components[1].disable(true);
      }
      break;
    case "xcamoff":
      clickCount++;
      if (clickCount > 2) {
        interaction.message.components[2].components[2].disable(true);
      }
      break;
    case "xunclaim":
      clickCount++;
      if (clickCount > 2) {
        interaction.message.components[2].components[3].disable(true);
      }
      break;
    default:
      break;
  }
}
function setBwbListInChannel(guild, member, channel) {
  const op = ["blackList", "whiteList", "banList"];
  let count = 0;
  while (count < op.length) {
    const list = getBwbList(guild.id, member.id, op[count]);
    switch (op[count]) {
      case "blackList":
        list.forEach((uid) => {
          channel.permissionOverwrites.edit(uid, { Connect: false });
        });
        break;
      case "whiteList":
        list.forEach((uid) => {
          channel.permissionOverwrites.edit(uid, { Connect: true });
        });
        break;
      case "banList":
        list.forEach((uid) => {
          channel.permissionOverwrites.edit(uid, { ViewChannel: false });
        });
        break;
    }
    count++;
  }
}

async function makeRoomFromParent(guild, member, parentId, name, limit) {
  const voiceChannel = await guild.channels.create({
    name: `${name} | ${member.user.username}`,
    type: ChannelType.GuildVoice,
    parent: parentId,
    permissionOverwrites: member.voice.channel.parent.permissions,
    userLimit: limit,
  });
  return voiceChannel;
}

function checkMemberInZone(guildId, member) {
  let inZone = false;
  if (member.voice.channel) {
    inZone = isParentHasOneTap(guildId, member.voice.channel.parent?.id);
  }
  return inZone;
}

//name seters
async function handleCooldown(client, guild, member, name) {
  let isEdited = false;
  let timeout = null;

  if (!client.coolDown.get(member.voice.channel.id)) {
    await member.voice.channel.setName(name);
    client.coolDown.set(member.voice.channel.id, {
      name: name,
      timeout: 5,
    });
    const voiceChannel = member.voice.channel;
    const x = setInterval(async () => {
      //check if the voice channel exist on the guild.
      if (guild.channels.cache.get(voiceChannel?.id)) {
        let data = client.coolDown.get(voiceChannel.id);
        data["timeout"] = data["timeout"] - 1;
        client.coolDown.set(voiceChannel.id, data);

        if (data["timeout"] == 0) {
          if (voiceChannel.name != data["name"]) {
            await voiceChannel.setName(data["name"]);
          }
          client.coolDown.delete(voiceChannel.id);
          clearInterval(x);
        }
      } else {
        client.coolDown.delete(voiceChannel.id);
        clearInterval(x);
      }
    }, 1000 * 60);
    isEdited = false;
    timeout = 5;
  } else {
    // set anther name in channel.
    data = client.coolDown.get(member.voice.channel.id);
    data["name"] = name;
    timeout = data["timeout"];
    client.coolDown.set(member.voice.channel.id, data);
    isEdited = true;
  }
  return { isEdited, timeout };
}

function claimRoomfromOwner(guild, member) {
  let claimed = false;
  let oldOwnerId = null;
  if (!getOwnerByRoomId(guild.id, member.voice.channel.id)) {
    // claimed
    oldOwnerId = whoIsOwnerOfThisRoom(guild.id, member.voice.channel.id);
    // console.log(oldOwnerId);
    let ownerRole = getSetup(guild.id)["roomOwnerRole"];
    if (ownerRole) {
      if (oldOwnerId) {
        let user = guild.members.cache.get(oldOwnerId);
        user.roles.remove(ownerRole);
        member.roles.add(ownerRole);
      } else {
        member.roles.add(ownerRole);
      }
    }
    setOwnerByRoomId(guild.id, member.id, member.voice.channel.id);
    setUserValueById(guild.id, oldOwnerId, "roomId", null);
    setUserValueById(guild.id, member.id, "roomId", member.voice.channel.id);
    member.voice.channel.permissionOverwrites.set(
      member.voice.channel.parent.permissionOverwrites.cache
    );
    setBwbListInChannel(guild, member, member.voice.channel);
    resetManagersOfRoom(guild.id, member.voice.channel.id);

    claimed = true;
  } else {
    oldOwnerId = getOwnerByRoomId(guild.id, member.voice.channel.id);
  }
  return { claimed, oldOwnerId };
}

function releaseRoomOwnership(guild, member) {
  let released = false;
  if (getOwnerByRoomId(guild.id, member.voice.channel.id) == member.id) {
    let ownerRole = getSetup(guild.id)["roomOwnerRole"];
    setOwnerByRoomId(guild.id, null, member.voice.channel.id);
    setUserValueById(guild.id, member.id, "roomId", null);
    member.voice.channel.permissionOverwrites.set(
      member.voice.channel.parent.permissionOverwrites.cache
    );
    resetManagersOfRoom(guild.id, member.voice.channel.id);
    if (ownerRole) {
      member.roles.remove(ownerRole);
    }
    released = true;
  }
  return released;
}
function forceClaim(guild, member) {
  let ownerRole = getSetup(guild.id)["roomOwnerRole"];
  setOwnerByRoomId(guild.id, null, member.voice.channel.id);
  const oldOwnerId = getOwnerByRoomId(guild.id, member.voice.channel.id);
  setUserValueById(guild.id, oldOwnerId, "roomId", null);
  member.voice.channel.permissionOverwrites.set(
    member.voice.channel.parent.permissionOverwrites.cache
  );
  resetManagersOfRoom(guild.id, member.voice.channel.id);
  if (ownerRole) {
    member.roles.remove(ownerRole);
  }
}
function transferOwnership(guild, member, newOwner) {
  let transfered = false;
  let ownerId = null;
  if (releaseRoomOwnership(guild, member)) {
    ownerId = member.id;
    transfered = claimRoomfromOwner(guild, newOwner).claimed;
  } else {
    //you are not the owner of this room
    ownerId = getOwnerByRoomId(guild.id, member.voice.channel.id);
  }
  return { transfered, ownerId };
}

async function checkIfRoleOrUser(guild, uid) {
  const user = await guild.members.cache.get(uid);
  const role = await guild.roles.cache.get(uid);
  let isWhat = null;
  let some = null;
  let op = null;
  if (user) {
    isWhat = "user";
    some = user;
    op = user;
  } else if (role) {
    isWhat = "role";
    some = role;
    op = role;
  }
  return { isWhat, some, op };
}

async function handleListAction(client, message, targetId, action, listType) {
  const { guild, member } = message;
  const { some } = await checkIfRoleOrUser(guild, targetId);
  let userOrRole = some;
  let op = some;
  const g = {
    ban: { ViewChannel: action !== "add" },
    white: { ViewChannel: action === "add", Connect: action === "add" },
    black: { Connect: action !== "add" },
  };
  const count = countBwbList(guild.id, member.id, `${listType}List`);
  if (count >= client.system[getType(guild.id)].list) {
    return await embeds.prefix.subLimit(message);
  }
  await member.voice.channel.permissionOverwrites.edit(
    userOrRole?.id,
    g[listType]
  );
  if (action == "add" && listType != "white") {
    await rejectMemberFromRoom(guild, member, userOrRole?.id);
  }
  if (action == "add") {
    const x = transferUserFromList(
      guild.id,
      member.id,
      userOrRole?.id,
      `${listType}List`
    );
    if (x == false) {
      if (message?.type) {
        return await embeds.room.AlreadyAction(
          message,
          `added in ${listType}List`,
          userOrRole,
          false
        );
      } else {
        return await prefix.AlreadyAction(
          message,
          `added in ${listType}List`,
          userOrRole
        );
      }
    } else if (x == null) {
      let x = bwbList(
        guild.id,
        member.id,
        userOrRole.id,
        `${listType}List`,
        true // remove
      );

      if (!x) {
        if (message?.type) {
          return await embeds.room.AlreadyAction(
            message,
            `added in ${listType}List`,
            userOrRole,
            false
          );
        } else {
          return await prefix.AlreadyAction(
            message,
            `added in ${listType}List`,
            userOrRole
          );
        }
      } else {
      }
    }
  }
  if (action != "add") {
    let x = bwbList(
      guild.id,
      member.id,
      userOrRole.id,
      `${listType}List`,
      false // remove
    );
    if (!x) {
      if (message?.type) {
        return await embeds.room.AlreadyAction(
          message,
          `removed from ${listType}List`,
          userOrRole,
          false
        );
      } else {
        return await prefix.AlreadyAction(
          message,
          `removed from ${listType}List`,
          userOrRole
        );
      }
    }
  }

  //message
  if (message?.type) {
    await embeds.room.successfulAction(
      message,
      action === "add" ? `Added to ${listType} ` : `Removed from ${listType} `,
      `${op} from your ${action === "add" ? "channel" : `${listType} List`}`,
      false
    );
  } else {
    await prefix.successfulAction(
      message,
      action === "add" ? `Added to ${listType} ` : `Removed from ${listType} `,
      `${op} from your ${action === "add" ? "channel" : `${listType} List`}`
    );
  }
}

/////////[ Glitching rooms ]==========
async function stopGlitching(client, guild, member) {
  client.coolDown.set(member.id, 30);
  // message embed
  const userDM = await member.createDM();
  const oneTap = await guild.channels.cache.get(getSetup(guild.id)["voiceId"]);
  let invite;
  if (userDM) {
    const dateNow = Date.now();
    const timeoutDuration = 30 * 1000;
    const newTime = Math.floor((dateNow + timeoutDuration) / 1000);

    const initialEmbed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        `Hi! ${member}, we caught Glitching.\nYou can create a onetap again <t:${newTime}:R>`
      );
    const timeoutEndsEmbed = new EmbedBuilder()
      .setColor("Green")
      .setDescription(
        `${member} Now you can create a onetap again <#${oneTap.id}>`
      );
    invite = await guild.invites
      .create(oneTap.id, {
        unique: false,
        maxAge: 0,
      })
      .catch(async (err) => {
        invite = null;
      });
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel(oneTap.name)
        .setURL(`https://discord.gg/${invite.code}`)
      // .setURL(`https://discord.com/channels/${guild.id}/${oneTap.id}`)
    );
    await userDM.send({ embeds: [initialEmbed] }).then(async (msg) => {
      setTimeout(async () => {
        if (invite) {
          await msg.edit({ embeds: [timeoutEndsEmbed], components: [row] });
        } else {
          await msg.edit({ embeds: [timeoutEndsEmbed] });
        }
      }, timeoutDuration);
    });
  }
  oneTap.permissionOverwrites.edit(member.id, { Connect: false });
  const mId = member?.id;
  if (mId) {
    const x = setInterval(() => {
      const t = client.coolDown.get(mId) - 1;
      client.coolDown.set(mId, t);
      if (t < 1) {
        // End CoolDown Glitching
        oneTap.permissionOverwrites.edit(member.id, { Connect: true });
        client.coolDown.delete(mId);
        clearInterval(x);
      }
    }, 1000);
  }
}

async function rejectMemberFromRoom(guild, member, someId) {
  const { some, isWhat } = await checkIfRoleOrUser(guild, someId);
  if (!some) return false; // TODO: here
  const ejectedRoomId = await guild.channels.cache.get(
    getSetup(guild.id)["ejectedRoom"]
      ? getSetup(guild.id)["ejectedRoom"]
      : getSetup(guild.id)["voiceId"]
  );
  await member.voice.channel.permissionOverwrites.edit(someId, {
    Connect: false,
  });
  if (isWhat == "user") {
    if (some.voice.channel) {
      if (
        member.voice.channel.id == some.voice.channel.id &&
        some.id != member.id
      ) {
        await some.voice.setChannel(ejectedRoomId);
      }
    }
  } else if (isWhat == "role") {
    member.voice.channel.members.forEach(async (m) => {
      if (m.id !== member.id) {
        if (m.roles.cache.has(some?.id) && m.voice.channel) {
          await m.voice.setChannel(ejectedRoomId);
        }
      }
    });
  }
}

///////////////////[FUNCTIONS OneTap]//////////////////////

module.exports = {
  haveYouBoostedOurServer,
  isCuldaDev,
  formatDate,
  getDateFromId,
  createRoomFromParent,
  deleteRoomFromParent,
  makeRoomFromParent,
  checkMemberInZone,
  handleCooldown,
  claimRoomfromOwner,
  releaseRoomOwnership,
  transferOwnership,
  checkIfRoleOrUser,
  handleListAction,
  stopGlitching,
  rejectMemberFromRoom,
  handleButtonClick,
  forceClaim,
};
