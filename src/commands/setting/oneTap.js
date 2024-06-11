//slash command to setup the join to create room

const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
} = require("discord.js");

const {
  setupOneTap,
  generateOneTapDb,
  isParentHasOneTap,
} = require("../../libs/engines/engine.js");
const embeds = require("../../embeds/admin.js");
const prefix = require("../../embeds/prefix.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup-onetap")
    .setDescription("Setup Ephemira In Your Server")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction, client) {
    const { member, channel, guild, options } = interaction;
    generateOneTapDb(guild.id);
    const voiceroom1 = await guild.channels.create({
      name: `Ephemira ✨`,
      type: ChannelType.GuildCategory,
    });

    const voiceroom2 = await guild.channels.create({
      name: `・interface`,
      type: ChannelType.GuildText,
      parent: voiceroom1,
    });

    const voiceroom3 = await guild.channels.create({
      name: `・Create Voice`,
      type: ChannelType.GuildVoice,
      parent: voiceroom1,
      userLimit: 1,
    });

          const fixedRooms = await guild.channels.cache
            .filter(
              (room) =>
                room.type != ChannelType.GuildCategory &&
                room.type != ChannelType.GuildText &&
                room.parentId === voiceroom3.parent.id
            )
            .map((room) => {
              return room.id;
            });
   
          let panelroom1 = voiceroom2;
          let panelroom = panelroom1.id;
          setupOneTap(
            guild.id,
            voiceroom3.id,
            voiceroom3.parent.id,
            fixedRooms
          );
          // message done
          await embeds.voiceSuccessfullySet(interaction, voiceroom3);
          await prefix.roomHelp(interaction, panelroom, false)
        
      
    
  },
};
