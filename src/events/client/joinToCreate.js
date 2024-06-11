const {
  Events,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const chalk = require("chalk");
const CULDA = require("../../config/devs/culda.json");
const { addGuild } = require("../../libs/engines/guildChecker.js");    
const fs = require('fs');
const {
  getSetup,
  deleteRoom,
  isParentHasOneTap,
  cleanRoomFromOwner,
  createUserById,
  returnRoomToOwner,
} = require("../../libs/engines/engine.js");
const {
  createRoomFromParent,
  deleteRoomFromParent,
  stopGlitching,
} = require("../../libs/tools.js");

module.exports = {
  //listen to when a user joins, leaves or switches channel
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState, client, interaction) {
    const newChannel = newState.channel;
    const oldChannel = oldState.channel;
    const { member, guild } = newState;
    const setup = getSetup(guild.id);
    const guildId = guild.id;
    let configData = {};

const configFile = "C:/Users/akram/Desktop/Ephemira OneTap/src/db/logsrooms.json";
configData = JSON.parse(fs.readFileSync(configFile, 'utf8'));
    const logChannelId = configData[guildId].logChannel;
    const logChannel = guild.channels.cache.get(logChannelId);
    if (oldChannel == undefined && newChannel != undefined) {
      // JOIN ROOM
      if (newChannel.parent) {
        if (!member.user.bot) {
          createUserById(guild.id, member.id);
          returnRoomToOwner(guild.id, member.id, newChannel.id);
          // only users.
          if (
            !client.coolDown.get(member.id) &&
            newChannel.id == setup["voiceId"] &&
            newChannel.parent
          ) {
            const voiceChannel = await createRoomFromParent(
              guild,
              member,
              newChannel.parent.id
            );
            setTimeout(async () => {
              // cooldwon to move the member to the created room.
              try {
                // move member to his voice channel
                await member.voice.setChannel(voiceChannel);
                console.log(
                  chalk.green(
                    `(${guild.name}) <${member.user.username}> Create Room`
                  )
                );
  
 if (!configData[guildId] || !configData[guildId].logChannel) {
            return console.log('Log channel not set for this server.');
        }
        const ppEmbed = new EmbedBuilder()
              .setColor(0x4a89bd)
              .setTitle(`Ephemira's Temporary Channel Logs`)
              .setDescription(`<#${voiceChannel.id}> New Temporary Channel Created By ${member}`)
              .setTimestamp()
logChannel.send({embeds:[ppEmbed]})
              } catch (e) {
                console.log(e)
                await stopGlitching(client, guild, member);
                console.log(
                  chalk.red(
                    `(${guild.name}) <${member.user.username}> Glitching Room`
                  )
                );
                await deleteRoomFromParent(guild, voiceChannel);
              }
            }, 100);
          }
        }
      }
    } else if (newChannel == undefined && oldChannel) {
      const { member, guild } = oldState;
      const setup = getSetup(guild.id);
      // LEAVE ROOM.

      if (oldChannel.parent) {
        if (!member.user.bot) {
          cleanRoomFromOwner(guild.id, member.id, oldChannel.id); // owner left the room;
          if (
            isParentHasOneTap(guild.id, oldChannel.parent.id) &&
            !setup["fixedRooms"].includes(oldChannel.id) &&
            setup["voiceId"] != oldChannel.id
          ) {
            const memberCount = oldChannel.members.filter(
              (m) => !m.user.bot
            ).size;
            if (memberCount == 0) {
              await deleteRoomFromParent(guild, oldChannel);
            }
          }
        }
      }
    } else {
      if (oldChannel !== newChannel) {
        if (newChannel) {
          const { member, guild } = newState;
          const setup = getSetup(guild.id);
          // SWITCH ROOM
          if (newChannel.parent) {
            if (!member.user.bot) {
              createUserById(guild.id, member.id);
              returnRoomToOwner(guild.id, member.id, newChannel.id);
              if (
                !client.coolDown.get(member.id) &&
                newChannel.id == setup["voiceId"] &&
                newChannel.parent
              ) {
                const voiceChannel = await createRoomFromParent(
                  guild,
                  member,
                  newChannel.parent.id
                );
                setTimeout(async () => {
                  // cooldwon to move the member to the created room.
                  try {
                    // move member to his voice channel
                    await member.voice.setChannel(voiceChannel);
                    console.log(
                      chalk.green(
                        `(${guild.name}) <${member.user.username}> Create Room`
                      )
                    );
                    if (!configData[guildId] || !configData[guildId].logChannel) {
                      return console.log('Log channel not set for this server.');
                  }
                  const ppEmbed = new EmbedBuilder()
                        .setColor(0x4a89bd)
                        .setTitle(`Ephemira's Temporary Channel Logs`)
                        .setDescription(`<#${voiceChannel.id}> New Temporary Channel Created By ${member}`)
                        .setTimestamp()
          logChannel.send({embeds:[ppEmbed]})
                  } catch (e) {
                    await stopGlitching(client, guild, member);
                    console.log(
                      chalk.red(
                        `(${guild.name}) <${member.user.username}> Glitching Room`
                      )
                    );

                    await deleteRoomFromParent(guild, voiceChannel);
                  }
                }, 100);
              }
            }
          }
        }
        if (oldChannel) {
          const { member, guild } = oldState;
          const setup = getSetup(guild.id);
          if (oldChannel.parent) {
            if (!member.user.bot) {
              cleanRoomFromOwner(guild.id, member.id, oldChannel.id); // owner left the room;
              if (
                isParentHasOneTap(guild.id, oldChannel.parent.id) &&
                !setup["fixedRooms"].includes(oldChannel.id) &&
                setup["voiceId"] != oldChannel.id
              ) {
                const memberCount = oldChannel.members.filter(
                  (m) => !m.user.bot
                ).size;
                if (memberCount == 0) {
                  await deleteRoomFromParent(guild, oldChannel);
                }
              }
            }
          }
        }
      }
    }
  },
};
