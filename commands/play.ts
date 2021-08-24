import { SlashCommandBuilder } from "@discordjs/builders";
import assert from "assert";
import Discord, { CommandInteraction } from "discord.js";
import fs from "fs";
import path from "path";
import * as audio from "../utilities/audio";
import { toVoiceChannel } from "../utilities/channels";
import * as sql from "../utilities/sql";
import StreamManager from "../utilities/streamManager";

// play.ts
// ========
module.exports = {
    name: "play",
    admin: false,
    requireVoice: true,
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Plays a audio clip")
        .addStringOption((option) =>
            option
                .setName("sound")
                .setDescription("The name of the sound to play")
                .setRequired(true),
        ),
    async execute(interaction: CommandInteraction) {
        let soundName = interaction.options.getString("sound");
        assert(soundName, "sound name is required");

        assert(
            interaction.member instanceof Discord.GuildMember,
            "member must be a guild member",
        );

        // put arg to lowercase
        soundName = soundName.toLowerCase();

        // check that the user is in a voice channel
        const voiceChannel = toVoiceChannel(interaction.member.voice.channel);
        if (!voiceChannel) {
            return await interaction.reply({
                content: "Please join a voice channel first!",
                ephemeral: true,
            });
        }

        // check if file exists
        const audioDir = audio.getAudioDir();
        const filePath = path.join(audioDir, `${soundName}.mp3`);
        if (!fs.existsSync(filePath)) {
            return await interaction.reply({
                content: `Sound file ${soundName} not found`,
                ephemeral: true,
            });
            // if requested this will send the sound list to the user
            // return await audio.sendSoundList(interaction);
        }

        // notify user that the sound is being played
        await interaction.reply({
            content: `Playing ${soundName}`,
        });

        const volume = await sql.getSoundVolume(soundName);

        // join and play audio
        await StreamManager.playMP3(voiceChannel, filePath, volume);

        // sound played successfully, therefore update database
        await sql.dbMakeSoundLog(soundName, interaction.member);
    },
};
