import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { version } from "../package.json";
// version.ts
// ========
module.exports = {
    name: "version",
    admin: false,
    requireVoice: false,
    data: new SlashCommandBuilder()
        .setName("version")
        .setDescription("Displays bot version"),
    async execute(interaction: CommandInteraction) {
        interaction.reply(`v${version}`);
    },
};
