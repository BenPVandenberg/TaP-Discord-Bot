import assert from "assert";
import Discord from "discord.js";
import fs from "fs";
import * as log from "../utilities/log";
import * as sql from "../utilities/sql";
import * as colors from "../utilities/colors";
import { Command } from "../utilities/types";
const config = require("../config.json");

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

export default async function onMessage(message: Discord.Message) {
    // easter egg for dms
    // nested if required to guarantee guild isn't null
    if (!message.guild) {
        if (!message.author.bot) {
            log.logToDiscord(
                `Private Message from <@${message.author.id}>: ${message.content}`,
            );
            message.reply(
                "Wow someone actually messaged me... don't like it, fuck off!",
            );
        }
        return;
    }

    // update chief of military tactics' role colour
    const chiefRole = message.guild.roles.cache.get("674039470084849691");
    if (!chiefRole) {
        log.logToDiscord(
            'Unable to get role "674039470084849691"\n' +
                "Formally chief of military tactics'",
            log.WARNING,
        );
        return;
    }

    chiefRole.edit({
        color: colors.getRandomColor(),
    });

    const commandRegex = /^[.,!\-+/'?;:][^_]\D\w/g;
    // check if it is a bot command in a non command channel
    if (
        !message.author.bot &&
        message.content.match(commandRegex) &&
        !config.command_channels.includes(message.channel.id)
    ) {
        const curChannel = message.channel!;
        if (curChannel instanceof Discord.DMChannel) {
            return;
        }

        log.logToDiscord(
            `<@${message.author}> tried to use bot command "${message.content}"` +
                ` in a non command channel ${curChannel.toString()}`,
            log.INFO,
        );
        message.author.send(
            `Oi! Bot commands are not allowed in ${message.channel.toString()}.`,
        );
        message.delete();
    }

    // check if its a restricted bot out of its channel
    const currentChannel = message.channel;
    if (
        message.author.bot &&
        config.restricted_bots.includes(message.author.id) &&
        !config.command_channels.includes(message.channel.id) &&
        currentChannel.type === "GUILD_TEXT"
    ) {
        log.logToDiscord(
            `Restricted bot <@${message.author}> is talking in #${currentChannel.name}`,
            log.INFO,
        );
        message.delete();
    }

    if (!message.content.trim().startsWith(config.prefix)) {
        // check if it is a command for us, if not break
        return;
    }

    // isolate command and args
    const args = message.content.slice(config.prefix.length).trim().split(" ");
    let command = args.shift();

    // ensure the command isn't just a /
    assert(typeof command === "string");
    command = command.toLowerCase();

    // check if the bot has the command
    let cmd: Command | null = null;
    for (const currentCommand of botCommands) {
        // check if command matches name or any alias
        if (
            currentCommand.name === command ||
            (currentCommand.alias && currentCommand.alias.includes(command))
        ) {
            cmd = currentCommand;
        }
    }

    // if no command found return
    if (!cmd) return;

    // log command received
    assert(message.member instanceof Discord.GuildMember);
    console.log(
        `Command Received from ${message.member.user.username}: ${message.content}`,
    );

    try {
        // check if cmd requires admin and if user is admin
        if (cmd.admin) {
            const userIsAdmin = await sql.isAdmin(message.member);
            if (!userIsAdmin) {
                // user doesn't have permissions to run this command
                message.reply("You must be an admin to run this command");
                return;
            }
        }

        if (cmd.requireVoice) {
            // check if the bot is already talking
            if (!botVoiceReady) {
                message.reply(
                    "I'm currently busy. Try again in a few seconds.",
                );
                return;
            }
            botVoiceReady = false;
            await cmd.execute(message, args);
            botVoiceReady = true;
        } else {
            cmd.execute(message, args);
        }
    } catch (error) {
        console.error(error);
        message.reply("there was an error trying to execute that command!");
        log.logToDiscord(error, log.ERROR);
    }
}
