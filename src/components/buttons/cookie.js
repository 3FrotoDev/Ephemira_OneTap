const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const tools = require("../../libs/tools.js");
const emojis = require("../../config/emojis/emojis.json");
const embeds = require("../../embeds/index.js");
const { getSetup } = require("../../libs/engines/engine.js");
const phrases = [
  "Release what demands a vice-like grip.",
  "I've journeyed this far, only to refuse stagnation.",
  "Vulnerability echoes faith, bearing the face of valor.",
  "Into the abyss of the forest, I descend to unearth my essence.",
  "In the face of fear, summon courage and proceed.",
  "With each compromise for acceptance, self-love wanes.",
  "Silent communion with you, a cacophonous symphony in my heart.",
  "From above, gifts descend, love untouched by prerequisites.",
  "Life's art is not control, but alchemy from adversity.",
  "Beware blind trust, for appearances can deceive.",
  "Tough love prevails when met with an equal measure of affection.",
  "Joy blooms when we embrace life's hidden treasures.",
  "From each ending, a new beginning emerges.",
  "Step by deliberate step, traverse the distant path.",
  "Wings are futile without the audacity to soar.",
  "She embodies unwritten poetry, a living verse.",
  "The past is uncharted terrain, I am reborn today.",
  "Yesterday's weight should not burden today's promise.",
  "Success isn't a dream; it's forged through relentless toil.",
  "Rainbows emerge after enduring life's storms.",
  "We are incomplete in isolation, finding meaning through connection.",
  "Our choices define our journey's worth.",
  "From ashes of loss, rebirth springs eternal.",
  "Women are reservoirs of strength in adversity's crucible.",
  "Cherish all, confide in few, harm none.",
  "A single dark chapter does not conclude your narrative.",
  "Your identity transcends past actions, it thrives in the present.",
  "It's never too late to rewrite your destiny.",
  "Self-love is not arrogance, but the pillar of sanity.",
  "Life's purpose transcends mere survival.",
  "Mold your scars into wisdom's armor.",
  "The path to success is ever-evolving and tumultuous.",
  "Aspire to greatness; greatness shall follow your pursuit.",
  "Excellence is an ongoing journey, not a destination.",
  "Seize the moment, for action begets transformation.",
  "Wanderers aren't lost; they explore the unknown.",
  "Self-doubt is the bane of creativity's flame.",
  "Delay leads to regret; seize the day unflinchingly.",
  "Embrace uncertainty today to unveil boundless tomorrows.",
  "Endings herald fresh beginnings, unbeknownst at the time.",
  "Bold women carve history's indelible mark.",
  "Within you resides your greatest treasure.",
  "Love endures even in life's twilight.",
  "Live the present, for dreams, left unattended, wither.",
  "Unfazed by storms, I learn to navigate life's tempests.",
  "Breathe, my love, for this is but one chapter in your epic saga.",
  "Learning transcends graduation; life is the grand academy.",
];
module.exports = {
  data: {
    name: "xopen",
  },
  async execute(interaction, client) {
    const { guild, member, channel } = interaction;
    //user claims the room after he clicks
    if (!tools.checkMemberInZone(guild.id, member)) {
      return (
        await interaction.deferReply({ ephemeral: true }),
        await embeds.room.notInZone(interaction, getSetup(guild.id)["voiceId"])
      );
    }
    const fortune = phrases[Math.floor(Math.random() * phrases.length)];
    interaction.message.edit({ content: `${member}` +fortune , embeds:[],components:[]});
    },
};
