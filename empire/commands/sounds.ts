import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { sendSoundList } from "../utilities/audio";
// version.ts
// ========
module.exports = {
    name: "sounds",
    admin: false,
    requireVoice: false,
    data: new SlashCommandBuilder()
        .setName("sounds")
        .setDescription("Show list of current sounds."),
    async execute(interaction: CommandInteraction) {
        return await sendSoundList(interaction);
    },
};
