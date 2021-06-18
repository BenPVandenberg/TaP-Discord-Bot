require("dotenv").config();
require("console-stamp")(console, { pattern: "dd/mm/yyyy HH:MM:ss.l" });
import assert from "assert";
import Discord, { Client, Intents } from "discord.js";
import fs from "fs";
import * as channels from "./utilities/channels";
import * as colors from "./utilities/colors";
import * as log from "./utilities/log";
import * as sql from "./utilities/sql";
import { Command } from "./utilities/types";
import { SharedAudio } from "./utilities/voice";
const config = require("./config.json");

const bot = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    ],
});
const bot_commands: Command[] = [];

let bot_voice_ready = true;

// find all commands
const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".ts"));

// add commands to bot
for (const file of commandFiles) {
    if (["play.ts"].includes(file)) {
        const command: Command = require(`./commands/${file}`);
        bot_commands.push(command);
    }
}

// ready
/* Emitted when the client becomes ready to start working.    */
bot.on("ready", () => {
    console.log("This bot is online!");
});

// message
/* Emitted whenever a message is created.
PARAMETER      TYPE           DESCRIPTION
message        Message        The created message    */
bot.on("message", async (message) => {
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

    // check if it is a bot command in a non command channel
    if (
        !message.author.bot &&
        (message.content.startsWith(config.prefix) ||
            message.content.startsWith("-")) &&
        !config.command_channels.includes(message.channel.id)
    ) {
        const cur_channel = message.channel!;
        if (cur_channel instanceof Discord.DMChannel) {
            return;
        }

        log.logToDiscord(
            `<@${message.author}> tried to use bot command "${message.content}"` +
                ` in a non command channel #${cur_channel.name}`,
            log.INFO,
        );
        message.author.send("Oi! Bot commands are not allowed there.");
        message.delete();
    }

    // check if its a restricted bot out of its channel
    if (
        message.author.bot &&
        config.restricted_bots.includes(message.author.id) &&
        !config.command_channels.includes(message.channel.id)
    ) {
        const cur_channel = message.channel!;
        if (cur_channel instanceof Discord.DMChannel) {
            return;
        }

        log.logToDiscord(
            `Restricted bot <@${message.author}> is talking in #${cur_channel.name}`,
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
    for (const currentCommand of bot_commands) {
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
        // check if the bot is already talking
        if (cmd.requireVoice) {
            if (!bot_voice_ready) {
                message.reply(
                    "I'm currently busy. Try again in a few seconds.",
                );
                return;
            }
            bot_voice_ready = false;
            await cmd.execute(message, args);
            bot_voice_ready = true;
        } else {
            cmd.execute(message, args);
        }
    } catch (error) {
        console.error(error);
        message.reply("there was an error trying to execute that command!");
        log.logToDiscord(error, log.ERROR);
    }
});

// Create an event listener for new guild members
bot.on("guildMemberAdd", async (member) => {
    // Send the message to a designated channel on a server:
    const generalChannel = channels.toTextChannel(
        member.guild.channels.cache.find((ch) => ch.name === "general"),
    );

    const rules_string =
        "1. Be wary of the wild DeadAss + Grim, they DO bite! \n" +
        "2. This is NOT a democracy (RIP ur free will) \n" +
        '3. The President is "not racist" -President \n' +
        "4. Add game ranks by using /ranks \n" +
        "BONUS: .play gbtm ;)";

    // Send the message, mentioning the member
    generalChannel.send(
        `Welcome to the server, ${member.toString()}.\n` + rules_string,
    );

    await sql.verifyUser(member);
});

// voiceStateUpdate
/* Emitted whenever a user changes voice state - e.g. joins/leaves a channel, mute/unmute.
PARAMETER    TYPE             DESCRIPTION
oldMember    GuildMember      The member before the voice state update
newMember    GuildMember      The member after the voice state update    */
bot.on("voiceStateUpdate", async (oldMember, newMember) => {
    const sessionID = newMember.sessionID ?? oldMember.sessionID;

    // Check if sessionID is valid
    if (!sessionID) {
        log.logToDiscord(
            "voiceStateUpdate: No Session for both states",
            log.WARNING,
        );
        return;
    }
    // Assert member is not null
    if (!newMember.member) {
        log.logToDiscord("voiceStateUpdate: Member Exception", log.WARNING);
        return;
    }

    // if a bot
    if (newMember.member.user.bot) return;

    const in_voice_role = await newMember.guild.roles.fetch(
        config["in_voice_role_id"],
    );

    // send an error if we cant find the role
    if (!in_voice_role) {
        log.logToDiscord(
            `Cant find role ${config["in_voice_role_id"]}`,
            log.WARNING,
        );
    }

    if (oldMember.channelID !== null && newMember.channelID === null) {
        // leave event
        await sql.dbCloseVoiceLog(
            newMember.member,
            oldMember.channelID,
            sessionID,
        );

        // remove in voice role
        if (in_voice_role) {
            newMember.member.roles.remove(in_voice_role);
        }
    } else if (oldMember.channelID === null && newMember.channelID !== null) {
        // Join event
        assert(newMember.channel);
        await sql.dbMakeVoiceLog(
            newMember.member,
            newMember.channelID,
            newMember.channel.name,
            sessionID,
        );

        // add the invoice role
        if (in_voice_role) {
            newMember.member.roles.add(in_voice_role);
        }
    } else if (
        oldMember.channelID !== null &&
        newMember.channelID !== null &&
        oldMember.channelID !== newMember.channelID
    ) {
        // switch channels event
        await sql.dbCloseVoiceLog(
            newMember.member,
            oldMember.channelID,
            sessionID,
        );
        assert(newMember.channel);
        await sql.dbMakeVoiceLog(
            newMember.member,
            newMember.channelID,
            newMember.channel.name,
            sessionID,
        );
    }
});

// presenceUpdate
/* Emitted whenever a guild member's presence changes, or they change one of their details.
PARAMETER    TYPE               DESCRIPTION
oldMember    GuildMember        The member before the presence update
newMember    GuildMember        The member after the presence update    */
bot.on("presenceUpdate", async (oldMember, newMember) => {
    // Assert member is not null
    if (!newMember.member) {
        assert(newMember.guild);

        log.logToDiscord("presenceUpdate: Member Exception", log.WARNING);
        return;
    }

    // if a bot
    if (newMember.member.user.bot) return;

    // check that both members are valid
    if (!newMember || !oldMember) return;

    // remove any activities that aren't a game
    const new_activities = newMember.activities.filter(
        (act) =>
            act.type === "PLAYING" && !config.ignore_games.includes(act.name),
    );
    const old_activities = oldMember.activities.filter(
        (act) =>
            act.type === "PLAYING" && !config.ignore_games.includes(act.name),
    );

    // TODO: Need a way to put identical games together in the db

    for (const game of old_activities) {
        // look for app in new_activities
        const search = new_activities.find((app) => app.name === game.name);
        if (search === undefined) {
            // no app in new presense, therefore close log
            await sql.dbCloseGameLog(newMember.member, game);
        }
    }

    for (const game of new_activities) {
        // look for app in old_activities
        const search = old_activities.find((app) => app.name === game.name);
        if (search === undefined) {
            // no app in prev presense, therefore new log
            await sql.dbMakeGameLog(newMember.member, game);
        }
    }
});

bot.on(
    "messageReactionAdd",
    async (
        reaction: Discord.MessageReaction,
        user: Discord.User | Discord.PartialUser,
    ) => {
        const emoji = reaction.emoji;
        if (emoji.name === "pngcliparthotdoghamburgerfrenchf") {
            reaction.message.react(emoji);
        }
    },
);

bot.on("shardError", async (error) => {
    log.logToDiscord(`shardError: ${error.message}`, log.ERROR);
    console.error("A websocket connection encountered an error:", error);
});

process.on("unhandledRejection", async (error) => {
    log.logToDiscord(`unhandledRejection: ${error}`, log.ERROR);
    console.error("Unhandled promise rejection:", error);
});

async function maintainance() {
    function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    while (config.maintainance_loop_min) {
        await delay(config.maintainance_loop_min * 60000);

        SharedAudio.checkTimeout();
    }
}

// init maintainance loop on separate thread
maintainance();

bot.login(process.env.DISCORD_LOGIN_TOKEN);
