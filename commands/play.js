const fs = require('fs');
// ranks.js
// ========
module.exports = {
  name: 'play',
  description: 'plays a audio clip',
  execute(message, args) {
    const all_sounds = fs.readdirSync('./audio');

    // put arg to lowercase if it exists
    try {
      args[0] = args[0].toLowerCase();

      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel) {
        return message.reply('please join a voice channel first!');
      }

      // check if file exists
      if (!fs.existsSync(`./audio/${ args[0] }.mp3`)) {
        throw 'not a valid sound';
      }

      // join and play yt audio
      voiceChannel.join().then(connection => {
        const dispatcher = connection.play(`./audio/${ args[0] }.mp3`);

        dispatcher.on('finish', () => voiceChannel.leave());
      });

      message.react('👍');

      // sound played successfully, therefore make log
      const play_data_path = 'data/play.json';
      if(fs.existsSync(play_data_path)) {
        const data = JSON.parse(fs.readFileSync(play_data_path));

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
    catch {
      let sound_list = '';
      const hidden_sounds = ['stfu0', 'stfu1', 'stfu2', 'timeout'];

      // get all current sounds
      for (const sound in all_sounds) {
        const cur_sound = all_sounds[sound].slice(0, -4);

        if (!hidden_sounds.includes(cur_sound)) {
          sound_list += '-' + cur_sound + '\n';
        }
      }

      message.reply('Available sounds:\n' + sound_list);
    }
  },
};
