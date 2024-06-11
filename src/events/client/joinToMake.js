const {
  Events,
  InteractionType,
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
const {
  getSetup,
  getMaker,
  isParentHasMaker,
} = require("../../libs/engines/engine.js");
const {
  makeRoomFromParent,
  stopGlitching,
} = require("../../libs/tools.js");

module.exports = {
  //listen to when a user joins, leaves or switches channel
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState, client) {
    const newChannel = newState.channel;
    const oldChannel = oldState.channel;
    if (oldChannel == undefined && newChannel != undefined) {
      const { member, guild } = newState;
      const setup = getMaker(guild.id, newChannel.id);
      // JOIN ROOM
      if (setup) {
        if (newChannel.parent) {
          if (!member.user.bot) {
            // only users.
            if (newChannel.id == setup["voiceId"] && !client.coolDown.get(member.id)) {
              // create room.
              const voiceChannel = await makeRoomFromParent(
                guild,
                member,
                newChannel.parent,
                setup["name"],
                setup["limit"]
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
                } catch (e) {
                  await stopGlitching(client,guild,member);
                  console.log(
                    chalk.red(
                      `(${guild.name}) <${member.user.username}> Glitching Room`
                    )
                  );
                  await voiceChannel?.delete();
                }
              }, 200);
            }
          }
        }
      }
    } else if (newChannel == undefined && oldChannel) {
      // left voice channel
      const { member, guild } = oldState;
      const setup = getMaker(guild.id, oldChannel.id);
      const set = getSetup(guild.id);
      // LEAVE ROOM.
      if (!setup) {
        if (oldChannel.parent) {
          if (!member.user.bot) {
            if (
              !set["fixedRooms"].includes(oldChannel.id) &&
              isParentHasMaker(guild.id, oldChannel.parent.id) &&
              setup?.voiceId != oldChannel.id
            ) {
              const memberCount = oldChannel.members.filter(
                (m) => !m.user.bot
              ).size;

              if (memberCount == 0) {
                await oldChannel?.delete();
              }
            }
          }
        }
      }
    } else {
      if (oldChannel !== newChannel) {
        // SWITCH ROoM
        if (newChannel) {
          // join
          // switch voice channel
          const { member, guild } = newState;
          const setup = getMaker(guild.id, newChannel.id);

          // JOIN ROOM
          if (setup) {
            if (newChannel.parent) {
              if (!member.user.bot) {
                // only users.
                if (newChannel.id == setup["voiceId"] && !client.coolDown.get(member.id)) {
                  // create room.
                  const voiceChannel = await makeRoomFromParent(
                    guild,
                    member,
                    newChannel.parent,
                    setup["name"],
                    setup["limit"]
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
                    } catch (e) {
                      await stopGlitching(client,guild,member);
                      console.log(
                        chalk.red(
                          `(${guild.name}) <${member.user.username}> Glitching Room`
                        )
                      );
                      await voiceChannel?.delete();
                    }
                  }, 200);
                }
              }
            }
          }
        }
        if (oldChannel) {
          // leave
          const { member, guild } = oldState;
          const setup = getMaker(guild.id, oldChannel.id);
          const set = getSetup(guild.id);
          // LEAVE ROOM.
          if (!setup) {
            if (oldChannel.parent) {
              if (!member.user.bot) {
                if (
                  !set["fixedRooms"].includes(oldChannel.id) &&
                  isParentHasMaker(guild.id, oldChannel.parent.id) &&
                  setup?.voiceId != oldChannel.id
                ) {
                  const memberCount = oldChannel.members.filter(
                    (m) => !m.user.bot
                  ).size;
                  if (memberCount == 0) {
                    await oldChannel?.delete();
                  }
                }
              }
            }
          }
        }
      }
    }
  },
};
