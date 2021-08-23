import assert from "assert";
import Discord, { CommandInteraction } from "discord.js";
import fs from "fs";
import * as sql from "./sql";

export function getAudioDir() {
    return process.env.AUDIO_DIR && process.env.AUDIO_DIR.trim() !== ""
        ? process.env.AUDIO_DIR
        : "./audio/";
}

export async function sendSoundList(
    interaction: CommandInteraction,
    audioDir?: string,
) {
    if (!audioDir) {
        audioDir = getAudioDir();
    }

    const allSounds = fs.readdirSync(audioDir);
    const hiddenSounds = await sql.getHiddenSounds();
    // max 3 horizontal fields are in a discord embed message
    const embedFields: string[] = ["", "", ""];
    let currentfield = 0;

    assert(interaction.member instanceof Discord.GuildMember);
    const soundList: Discord.MessageEmbed = new Discord.MessageEmbed()
        .setTitle("__**Available sounds**__")
        .setColor(interaction.member.displayHexColor)
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
                Number(soundIndex) / (allSounds.length / 3),
            );
            embedFields[currentfield] += "-" + curSound + "\n";
        }
    }

    embedFields.forEach((embed) => {
        if (embed !== "")
            soundList.addField("-------------------------", embed, true);
    });

    return interaction.reply({
        embeds: [soundList],
    });
}
