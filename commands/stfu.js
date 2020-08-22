const config = require('../config.json');
const ytdl = require('ytdl-core');
// ranks.js
// ========
module.exports = {
  name: 'stfu',
  description: 'Lets a user know they really need to stfu',
  execute(message, args) { // eslint-disable-line no-unused-vars
    const stfu_config = config.commands.stfu;
    const user_to_stfu = message.mentions.members.values().next().value;

    // verify the user @'d someone
    if (user_to_stfu === undefined) {
      message.reply('usage is /stfu @user');
      return;
    }

    const member_to_stfu = user_to_stfu.presence.member;
    const original_channel = member_to_stfu.voice.channel;

    // ensure member_to_stfu is in a voice channel
    if (!original_channel) {
      message.reply('user is not in a voice channel.');
      return;
    }

    // find a channel to move user to
    let eligible_channel;
    const channels = message.guild.channels.cache;
    for (const [key, channel] of channels.entries()) { // eslint-disable-line no-unused-vars
      if (channel.type === 'voice' && !channel.members.size && !['AFK'].includes(channel.name)) {
        eligible_channel = channel;
        break;
      }
    }

    // verify we got a channel to move to
    if (!eligible_channel) {
      message.reply('there arn\'t any eligible channels atm.');
    }

    // the magic
    message.react('👍');
    member_to_stfu.voice.setChannel(eligible_channel);

    // join and play yt audio
    eligible_channel.join().then(connection => {
      const random_index = Math.floor(Math.random() * stfu_config.length);
      const audioLink = stfu_config[random_index];
      const stream = ytdl(audioLink, { filter: 'audioonly' });
      const dispatcher = connection.play(stream);

      dispatcher.on('finish', () => {
        // return member
        member_to_stfu.voice.setChannel(original_channel);
        eligible_channel.leave();
      });
    });

    return;
  },
};
