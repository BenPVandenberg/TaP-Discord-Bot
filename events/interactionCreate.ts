import Discord from "discord.js";
import fs from "fs";
import * as sql from "../utilities/sql";
import { Command } from "../utilities/types";

let botVoiceReady = true;

const botCommands: Command[] = [];

// find all commands
const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".ts"));

// add commands to bot
for (const file of commandFiles) {
    const command: Command = require(`../commands/${file}`);
    botCommands.push(command);
}

export default async function onInteractionCreate(
    interaction: Discord.Interaction,
) {
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;
    const commandObj = botCommands.find(
        (command) => command.name === commandName,
    );
    if (!commandObj) return;

    // ensure voice is ready
    if (commandObj.requireVoice && !botVoiceReady) {
        return await interaction.reply({
            content: "I'm busy rn, try in a few sec.",
            ephemeral: true,
        });
    }

    // verify user is allowed to use command
    if (
        commandObj.admin &&
        interaction.member instanceof Discord.GuildMember &&
        !sql.isAdmin(interaction.member)
    ) {
        return await interaction.reply({
            content: "You're not my boss.",
            ephemeral: true,
        });
    }

    try {
        await commandObj.execute(interaction);
    } catch (error) {
        console.error(error);
        return await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
        });
    }
}
