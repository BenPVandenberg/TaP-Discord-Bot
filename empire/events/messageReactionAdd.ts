import Discord, { PartialMessageReaction } from 'discord.js';

export default async function onMessageReactionAdd(
  reaction: Discord.MessageReaction | PartialMessageReaction
  // user: Discord.User | Discord.PartialUser,
) {
  const emoji = reaction.emoji;
  if (emoji.name === 'pngcliparthotdoghamburgerfrenchf') {
    reaction.message.react(emoji);
  }
}
