import Discord from 'discord.js';
import config from '../config.json';
import * as colors from '../utilities/colors';
import * as log from '../utilities/log';

export default async function onMessage(message: Discord.Message) {
  // easter egg for dms
  if (!message.guild) {
    if (!message.author.bot) {
      log.logToDiscord(
        `Private Message from <@${message.author.id}>: ${message.content}`
      );
      message.reply(
        "Wow someone actually messaged me... don't like it, fuck off!"
      );
    }
    return;
  }

  // update chief of military tactics' role colour
  const chiefRole = message.guild.roles.cache.get('674039470084849691');
  if (!chiefRole) {
    log.logToDiscord(
      'Unable to get role "674039470084849691"\n' +
        "Formally chief of military tactics'",
      log.WARNING
    );
    return;
  }

  chiefRole.edit({
    color: colors.getRandomColor(),
  });

  const commandRegex = /^[.,!\-+/'?;:][^_]\D\w/g;
  // check if it is a bot command in a non command channel
  if (
    !message.author.bot &&
    message.content.match(commandRegex) &&
    !config.command_channels.includes(message.channel.id)
  ) {
    const curChannel = message.channel!;
    if (curChannel instanceof Discord.DMChannel) {
      return;
    }

    log.logToDiscord(
      `<@${message.author}> tried to use bot command "${message.content}"` +
        ` in a non command channel ${curChannel.toString()}`,
      log.INFO
    );
    message.author.send(
      `Oi! Bot commands are not allowed in ${message.channel.toString()}.`
    );
    message.delete();
  }

  // check if its a restricted bot out of its channel
  const currentChannel = message.channel;
  if (
    message.author.bot &&
    config.restricted_bots.includes(message.author.id) &&
    !config.command_channels.includes(message.channel.id) &&
    currentChannel.type === 'GUILD_TEXT'
  ) {
    log.logToDiscord(
      `Restricted bot <@${message.author}> is talking in #${currentChannel.name}`,
      log.INFO
    );
    message.delete();
  }
}
