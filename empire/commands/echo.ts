import { SlashCommandBuilder } from "@discordjs/builders";
import assert from "assert";
import { CommandInteraction, TextChannel } from "discord.js";
// echo.ts
// ========
module.exports = {
    name: "echo",
    admin: true,
    requireVoice: false,
    data: new SlashCommandBuilder()
        .setName("echo")
        .setDescription("echos the message given")
        .addStringOption((option) =>
            option
                .setName("message")
                .setDescription("The message to send")
                .setRequired(true)
        )
        .addChannelOption((option) =>
            option
                .setName("target")
                .setDescription("Channel to echo the message to")
        ),
    async execute(interaction: CommandInteraction) {
        const message = interaction.options.getString("message");
        assert(message, "message is required");
        const target = interaction.options.getChannel("target");

        if (target) {
            if (target instanceof TextChannel) {
                await target.send(message);
            }
        } else {
            // no target specified, echo to current channel
            if (interaction.channel) {
                await interaction.channel.send(message);
            }
        }
        return await interaction.reply({
            content: "Success!",
            ephemeral: true,
        });
    },
};
