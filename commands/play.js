const ytdl = require('ytdl-core');
const config = require('../config.json');
const fs = require('fs');
// ranks.js
// ========
module.exports = {
  name: 'play',
  description: 'plays a audio clip',
  execute(message, args) {
    const play_config = config.commands.play; // eslint-disable-line

    // put arg to lowercase if it exists
    try {
      args[0] = args[0].toLowerCase();
    }
    catch {} // eslint-disable-line no-empty
    if (message.channel.type === 'dm') return;

    // if an argument is given and its valid
    if (args && play_config[args[0]]) {

      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel) {
        return message.reply('please join a voice channel first!');
      }

      message.react('👍');

      // join and play yt audio
      voiceChannel.join().then(connection => {
        const audioLink = play_config[args[0]];
        const stream = ytdl(audioLink, { filter: 'audioonly' });
        const dispatcher = connection.play(stream);

        dispatcher.on('finish', () => voiceChannel.leave());
      });

      // sound played successfully, therefore make log
      const play_data_path = 'data/play.json';
      if(fs.existsSync(play_data_path)) {
        let data = JSON.parse(fs.readFileSync(play_data_path));

        if (data[args[0]]) data[args[0]] += 1;
        else data[args[0]] = 1;

        // update file
        fs.writeFile(play_data_path, JSON.stringify(data), (err) => {
          if (err) console.log(err);
        });

      }
      else {
        fs.writeFile(play_data_path, '{}', (err) => {
          if (err) console.log(err);
          else console.log(`Successfully created "${ play_data_path }"`);
        });
      }

    }
    else {
      let all_sounds = '';
      const hidden_sounds = [];

      // get all current sounds
      for (const sound in play_config) {
        if (!hidden_sounds.includes(sound)) {
          all_sounds += '-' + sound + '\n';
        }
      }

      message.reply('Available sounds:\n' + all_sounds);
    }

    return;
  },
};
