import assert from "assert";
import Discord from "discord.js";
import fs from "fs";
import path from "path";
import { toVoiceChannel } from "../utilities/channels";
import * as sql from "../utilities/sql";
import StreamManager from "../utilities/streamManager";

// play.ts
// ========
module.exports = {
    name: "play",
    description: "plays a audio clip",
    alias: ["p", "sound", "sounds"],
    admin: false,
    requireVoice: true,
    async execute(message: Discord.Message, args: string[]) {
        const audioDir = process.env.AUDIO_DIR ?? "./audio/";
        // put arg to lowercase if it exists
        try {
            // if this doesn't exist then this will throw an error
            const soundName = args[0].toLowerCase();
            assert(message.member);

            // check that the user is in a voice channel
            const voiceChannel = toVoiceChannel(message.member.voice.channel);
            if (!voiceChannel) {
                return message.reply("please join a voice channel first!");
            }

            const filePath = path.join(audioDir, `${soundName}.mp3`);
            // check if file exists
            if (!fs.existsSync(filePath)) {
                throw "not a valid sound";
            }

            // user in channel and sound is valid
            message.react("👍");

            const volume = await sql.getSoundVolume(soundName);

            // join and play yt audio
            await StreamManager.playMP3(voiceChannel, filePath, volume);

            // sound played successfully, therefore update database
            await sql.dbMakeSoundLog(soundName, message.member);
        } catch (e) {
            assert(message.member);
            const allSounds = fs.readdirSync(audioDir);
            const hiddenSounds = await sql.getHiddenSounds();
            const embedFields: string[] = ["", "", ""];
            let currentfield: number = 0;
            const soundList: Discord.MessageEmbed = new Discord.MessageEmbed()
                .setTitle("__**Available sounds**__")
                .setColor(message.member.displayHexColor)
                .setThumbnail(
                    "https://img2.pngio.com/white-speaker-icon-computer-icons-sound-symbol-audio-free-png-audio-clips-png-910_512.png",
                );

            // get all current sounds
            for (const soundIndex in allSounds) {
                const curSound = allSounds[soundIndex].slice(0, -4);

                if (
                    allSounds[soundIndex].endsWith(".mp3") &&
                    !hiddenSounds.includes(curSound)
                ) {
                    currentfield = Math.floor(
                        // @ts-ignore: soundIndex is a number
                        soundIndex / (allSounds.length / 3),
                    );
                    embedFields[currentfield] += "-" + curSound + "\n";
                }
            }

            embedFields.forEach((embed) => {
                if (embed !== "")
                    soundList.addField(
                        "-------------------------",
                        embed,
                        true,
                    );
            });

            message.channel.send({
                embeds: [soundList],
            });
        }
    },
};
