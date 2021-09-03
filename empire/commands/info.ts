import { SlashCommandBuilder } from "@discordjs/builders";
import assert from "assert";
import Discord, { CommandInteraction } from "discord.js";
// info.ts
// ========
module.exports = {
    name: "info",
    admin: false,
    requireVoice: false,
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("gets info of a user")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to get info of")
                .setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {
        const rUser = interaction.options.getUser("user");
        assert(rUser);
        const rMember = interaction.options.getMember("user");
        assert(rMember instanceof Discord.GuildMember);

        const micon = rUser.avatarURL();
        assert(micon);

        let rolesDisplay;
        try {
            rolesDisplay =
                // @ts-ignore
                rMember._roles
                    // @ts-ignore
                    .map((r) => `${interaction.guild.roles.cache.get(r).name}`)
                    .join(" | ") || "\u200B";
        } catch (e) {
            rolesDisplay = "\u200B";
        }

        assert(rMember.joinedAt);

        const memberEmbed = new Discord.MessageEmbed()
            .setDescription("__**Member Information**__")
            .setColor(rMember.displayHexColor)
            .setThumbnail(micon) // Their icon
            .addField("Name", `${rUser.username}#${rUser.discriminator}`)
            .addField("ID", rMember.id) // Their ID
            // .addField("Status", rUser.presence.status)
            .addField("Joined at", rMember.joinedAt.toLocaleString()) // When they joined
            .addField("Roles", rolesDisplay);

        await interaction.reply({ embeds: [memberEmbed] });
    },
};
