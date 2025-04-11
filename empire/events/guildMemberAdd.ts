import Discord from 'discord.js';
import * as channels from '../utilities/channels';
import * as sql from '../utilities/sql';

// time of last info message sent
let lastInfoMessageTimestamp = new Date(0);
let lastInfoMessage: Discord.Message | undefined = undefined;

export default async function onGuildMemberAdd(member: Discord.GuildMember) {
  // Send the message to a designated channel on a server
  const generalChannel = channels.toTextChannel(
    member.guild.channels.cache.find((ch) => ch.name === 'general')
  );

  // get greenlizid11's and grim's display names
  const greenlizid11 = member.guild.members.cache.get('462430429492805632');
  const grim = member.guild.members.cache.get('98498526471786496');

  const infoString =
    `1. Be wary of the wild ${greenlizid11?.displayName} + ${grim?.displayName}, they DO bite! \n` +
    '2. This is NOT a democracy (RIP ur free will) \n' +
    '3. "The President is not racist" -President';

  // check if a message was sent in the last day
  if (
    lastInfoMessageTimestamp.getTime() > Date.now() - 86400000 &&
    lastInfoMessage
  ) {
    // check if lastInfoMessage has already been edited
    if (
      !lastInfoMessage.toString().includes('Welcome to the server everyone')
    ) {
      // edit old message to be inclusive of everyone
      lastInfoMessage = await lastInfoMessage.edit(
        `Welcome to the server everyone!\n` + infoString
      );
    }
  } else {
    // Send the message, mentioning the member
    lastInfoMessage = await generalChannel.send(
      `Welcome to the server, ${member.toString()}.\n` + infoString
    );
  }

  // Add the member to the database
  await sql.verifyUser(member);
}
