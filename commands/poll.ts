import assert from "assert";
import { SlashCommandBuilder } from "@discordjs/builders";
import Discord, { CommandInteraction } from "discord.js";

// poll.ts
// ========
module.exports = {
    name: "poll",
    admin: false,
    requireVoice: false,
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("creates a poll")
        .addStringOption((option) =>
            option
                .setName("title")
                .setDescription("Title of the poll")
                .setRequired(true)
        ),
    // .addChannelOption((option) =>
    //     option.setName("target").setDescription("Channel to send the poll"),
    // )
    async execute(interaction: CommandInteraction) {
        assert(interaction.member instanceof Discord.GuildMember);

        const title = interaction.options.getString("title");
        // const target = interaction.options.getChannel("target");

        const pollEmbed = new Discord.MessageEmbed()
            .setTitle(`**${title}**`)
            .setColor(interaction.member.displayHexColor)
            .setFooter(`Asked By: ${interaction.member.displayName}`);

        assert(interaction.channel instanceof Discord.TextChannel);

        interaction.reply({ content: "Creating poll...", ephemeral: true });

        const pollMessage = await interaction.channel.send({
            embeds: [pollEmbed],
        });
        await pollMessage.react("👍");
        await pollMessage.react("👎");

        interaction.editReply({ content: "Poll created!" });
    },
};
