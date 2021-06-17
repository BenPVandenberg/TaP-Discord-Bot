import assert from "assert";
import Discord from "discord.js";
import fs from "fs";
import { toVoiceChannel } from "../utilities/channels";
import * as sql from "../utilities/sql";
import { playMP3 } from "../utilities/voice";
const config = require("../config.json");

// ranks.js
// ========
module.exports = {
    name: "play",
    description: "plays a audio clip",
    alias: ["p", "sound", "sounds"],
    requireVoice: true,
    async execute(message: Discord.Message, args: string[]) {
        // put arg to lowercase if it exists
        try {
            // if this doesn't exist then this will throw an error
            const soundName = args[0].toLowerCase();
            assert(message.member);

            const voiceChannel = toVoiceChannel(message.member.voice.channel);
            if (!voiceChannel) {
                return message.reply("please join a voice channel first!");
            }

            const filePath = `./audio/${soundName}.mp3`;
            // check if file exists
            if (!fs.existsSync(filePath)) {
                throw "not a valid sound";
            }

            message.react("👍");

            // join and play yt audio
            await playMP3(voiceChannel, filePath);

            // sound played successfully, therefore update database
            sql.dbMakeSoundLog(soundName, message.member);
        } catch (e) {
            const all_sounds = fs.readdirSync("./audio");
            const hidden_sounds = config.commands.play.hidden_sounds;
            let sound_list = "";

            // get all current sounds
            for (const sound in all_sounds) {
                const cur_sound = all_sounds[sound].slice(0, -4);

                if (
                    all_sounds[sound].endsWith(".mp3") &&
                    !hidden_sounds.includes(cur_sound)
                ) {
                    sound_list += "-" + cur_sound + "\n";
                }
            }

            assert(message.member);
            message.channel.send({
                embeds: [
                    new Discord.MessageEmbed()
                        .setTitle("__**Available sounds**__")
                        .setDescription(sound_list)
                        .setColor(message.member.displayHexColor)
                        .setThumbnail(
                            "https://img2.pngio.com/white-speaker-icon-computer-icons-sound-symbol-audio-free-png-audio-clips-png-910_512.png",
                        ),
                ],
            });
        }
    },
};
