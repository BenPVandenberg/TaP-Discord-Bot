import Discord from 'discord.js';

/**
 * Attempts to convert a GuildChannel to a TextChannel object
 * @param channel Discord channel to convert
 * @returns channel as a TextChannel
 */
export function toTextChannel(channel: Discord.Channel | undefined | null) {
  // check its not null
  if (!channel) {
    throw new Error('Invalid channel');
  }

  // convert to textchannel
  if (
    !((channel): channel is Discord.TextChannel =>
      channel.type === 'GUILD_TEXT')(channel)
  )
    throw new Error('Unable to make channel a text channel');

  return channel;
}

/**
 * Attempts to convert a GuildChannel to a VoiceChannel object
 * @param channel Discord channel to convert
 * @returns channel as a VoiceChannel
 */
export function toVoiceChannel(channel: Discord.Channel | undefined | null) {
  // check its not null
  if (!channel) {
    return null;
  }

  // convert to voicechannel
  if (
    !((channel): channel is Discord.VoiceChannel =>
      channel.type === 'GUILD_VOICE')(channel)
  )
    throw new Error('Unable to make channel a voice channel');

  return channel;
}
