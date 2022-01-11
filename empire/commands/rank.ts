import { SlashCommandBuilder } from "@discordjs/builders";
import assert from "assert";
import config from "../config.json";
import Discord, { CommandInteraction } from "discord.js";
import * as sql from "../utilities/sql";
// rank.ts
// ========
module.exports = {
    name: "rank",
    admin: false,
    requireVoice: false,
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Rank Management")
        .addSubcommand((subCommand) =>
            subCommand
                .setName("list")
                .setDescription("Lists all the available ranks")
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName("add")
                .setDescription("Add a rank")
                .addRoleOption((option) =>
                    option
                        .setName("rank")
                        .setDescription("The rank to add")
                        .setRequired(true)
                )
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("The user to add the rank to")
                )
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName("remove")
                .setDescription("Remove a rank")
                .addRoleOption((option) =>
                    option
                        .setName("rank")
                        .setDescription("The rank to remove")
                        .setRequired(true)
                )
                .addUserOption((option) =>
                    option
                        .setName("user")
                        .setDescription("The user to add the rank to")
                )
        ),
    async execute(interaction: CommandInteraction) {
        const subCommand = interaction.options.getSubcommand();

        switch (subCommand) {
            case "list":
                return await listRanks(interaction);
            case "add":
                return await editRank(interaction, "add");
            case "remove":
                return await editRank(interaction, "remove");
            default:
                return await interaction.reply({
                    content: "Unknown subcommand",
                    ephemeral: true,
                });
        }
    },
};

/**
 * List all free ranks in the config
 * @param interaction
 */
async function listRanks(interaction: CommandInteraction) {
    const rankConfig = config.commands.rank;

    // give user list of ranks
    // make string of ranks
    const allRanksString = "-" + rankConfig.free_ranks.join("\n-");

    const allRanksEmbedded = new Discord.MessageEmbed()
        .setColor("#0099ff")
        .addField("All Server Ranks", allRanksString, false);

    return await interaction.reply({
        embeds: [allRanksEmbedded],
        ephemeral: true,
    });
}

/**
 * Add/Remove a rank to a user
 * @param interaction
 */
async function editRank(
    interaction: CommandInteraction,
    operation: "add" | "remove"
) {
    const freeRanks = config.commands.rank.free_ranks;

    // check if user issuing command is an admin
    assert(interaction.member instanceof Discord.GuildMember);
    const userIsAdmin = sql.isAdmin(interaction.member);

    // check if a target user was given
    let memberToEdit = interaction.options.getMember("user");
    if (!memberToEdit) {
        memberToEdit = interaction.member;
    }
    assert(memberToEdit instanceof Discord.GuildMember);

    // user gave a rank
    const rankToAdd = interaction.options.getRole("rank");
    assert(rankToAdd instanceof Discord.Role);

    // check if rank is free, or if user is admin
    if (!freeRanks.includes(rankToAdd.name.toLowerCase()) && !userIsAdmin) {
        await interaction.reply({
            content: `${rankToAdd.name} is not a role I can assign.`,
            ephemeral: true,
        });
    }

    if (operation === "add") {
        // if member already has the role
        if (memberToEdit.roles.cache.has(rankToAdd.id)) {
            return await interaction.reply({
                content: `User already has ${rankToAdd.name} rank!`,
                ephemeral: true,
            });
        }

        // add rank to user
        await memberToEdit.roles.add(
            rankToAdd,
            `${interaction.user.username} added rank with /rank add`
        );
        return await interaction.reply({
            content: `Added ${rankToAdd.name} to ${memberToEdit.toString()}`,
        });
    } else if (operation === "remove") {
        // if member doesn't have the role
        if (!memberToEdit.roles.cache.has(rankToAdd.id)) {
            return await interaction.reply({
                content: `User doesn't have ${rankToAdd.name} rank!`,
                ephemeral: true,
            });
        }

        // remove rank from user
        await memberToEdit.roles.remove(
            rankToAdd,
            `${interaction.user.username} removed rank with /rank remove`
        );
        return await interaction.reply({
            content: `Removed ${
                rankToAdd.name
            } from ${memberToEdit.toString()}`,
        });
    }
}
