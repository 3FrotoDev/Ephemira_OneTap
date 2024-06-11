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
const CULDA = require("../../config/devs/culda.json");
const { addGuild } = require("../../libs/engines/guildChecker.js");
const { generateOneTapDb } = require("../../libs/engines/engine.js");

module.exports = {
  name: Events.GuildCreate,
  async execute(guild, client) {
    const LogGuild = await client.guilds.cache.get(CULDA.guildId);
    const LogChannel = await LogGuild.channels.cache.get(CULDA.BotsJoined);
    try {
      addGuild(guild.id);
      generateOneTapDb(guild.id);
      const Owner = await guild.members.cache.get(guild.ownerId);
      const Channels = await guild.channels.cache;
      const GuildChannels = guild.channels.cache.filter(
        (channel) => channel.type === ChannelType.GuildText
      );
      let invite;
      try {
        invite = await guild.invites.create(GuildChannels.random(), {
          unique: false,
          maxAge: 0,
        });
      } catch (e) {
        invite = null;
      }
      let vanity;
      try{
        const iv = await client.fetchInvite(invite?.code);
        if (iv.guild.vanityURLCode) {
          vanity = iv.guild.vanityURLCode;
        } else {
          vanity = null;
        }
      }
      catch(e){
        vanity = null
        console.error(e);
      }

      //
      
      const getVoice = async () => {
        let totalMembers = 0;
        await guild.channels.cache.forEach((channel) => {
          if (channel.type == 2) {
            totalMembers += channel.members.size;
          }
        });
        return totalMembers;
      };

      const Members = guild.members.cache;
      const MembersOnline = Members.filter(
        (member) => member.presence?.status === "online"
      );
      const Emojis = guild.emojis.cache.size;
      const BoostCount = guild.premiumSubscriptionCount;
      const voices = Channels.filter(
        (Channel) => Channel.type === ChannelType.GuildVoice
      ).size;
      const channels = Channels.filter(
        (Channel) => Channel.type === ChannelType.GuildText
      ).size;
      const categorys = Channels.filter(
        (Channel) => Channel.type === ChannelType.GuildCategory
      ).size;

      const VoiceCount = await getVoice();
      const embed = new EmbedBuilder()
        .setColor("White")
        .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
        .setThumbnail(Owner.user.avatarURL())
        .setDescription(
          `Server Name: ${guild.name} / ${guild.id}\nServer Owner: ${Owner.user.username} / ${Owner.id} / ${Owner}\nMember Count: ${Members.size}\nBoost Count: ${BoostCount}\nVoice Count: ${VoiceCount}\nMember Online: ${MembersOnline.size}\nText Channels: ${channels}\nVoice Channels: ${voices}\nCategory Count: ${categorys}\nEmojis Count: ${Emojis}\nVanity Invite: [${vanity}](https://discord.gg/${vanity})`
        );

      const row = new ActionRowBuilder().setComponents(
        new ButtonBuilder()
          .setLabel("Join Server")
          .setURL(invite ? invite.url : "https://discord.gg/culda")
          .setStyle(ButtonStyle.Link)
      );
      await LogChannel.send({
        content: "@here",
        embeds: [embed],
        components: [row],
      });
    } catch (e) {
      await LogChannel.send({
        content: "@here Maybe there is a Problem in json",
      });
    }
  },
};
