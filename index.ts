require("dotenv").config();
require("console-stamp")(console, { pattern: "dd/mm/yyyy HH:MM:ss.l" });
import fs from "fs";
import Discord from "discord.js";
import config from "./config.json";
import * as colors from "./utilities/colors";
import * as log from "./utilities/log";
import * as sql from "./utilities/sql";
import * as channels from "./utilities/channels";

const bot = new Discord.Client();
const bot_commands = new Discord.Collection<string, any>();

// find all commands
const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".ts"));

// add commands to bot
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    bot_commands.set(command.name, command);
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
            message.reply(
                "Wow someone actually messaged me... don't like it, fuck off!",
            );
        }
        return;
    }

    // update chief of military tactics' role colour
    const role = message.guild.roles.cache.get("674039470084849691");
    if (!role) {
        log.logToDiscord(
            'Unable to get role "674039470084849691"\n' +
                "Formally chief of military tactics'",
            log.getDefaultChannel(message.guild),
        );
        return;
    }

    role.edit({
        color: colors.getRandomColor(),
    });

    // check if it is a bot command in a non command channel
    if (
        (message.content.startsWith(config.prefix) ||
            message.content.startsWith("-") ||
            message.author.bot) &&
        !config.command_channels.includes(message.channel.id) &&
        message.author.username !== "T&P Bot"
    ) {
        message.delete();
    }

    // check if it is a command for us, if not break
    if (!message.content.startsWith(config.prefix) || message.author.bot) {
        return;
    }

    // isolate command and args
    const args = message.content.slice(config.prefix.length).trim().split(" ");
    let command = args.shift();

    // ensure the command isn't just a /
    if (command === undefined) return;
    command = command.toLowerCase();

    // check if the bot has the command
    if (!bot_commands.has(command)) return;

    // log command received
    if (!message.member) return;
    console.log(
        `Command Received from ${message.member.user.username}: ${message.content}`,
    );

    try {
        bot_commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply("there was an error trying to execute that command!");
        log.logToDiscord(
            error,
            log.getDefaultChannel(message.guild),
            log.ERROR,
        );
    }
});

// Create an event listener for new guild members
bot.on("guildMemberAdd", (member) => {
    // Send the message to a designated channel on a server:
    const generalChannel = channels.toTextChannel(
        member.guild.channels.cache.find((ch) => ch.name === "general"),
    );

    const rules_string =
        "1. Be wary of the wild DeadAss + Grim, they DO bite! \n" +
        "2. This is NOT a democracy (RIP ur free will) \n" +
        '3. The President is "not racist" -President \n' +
        "4. Add game ranks by using /ranks \n" +
        "BONUS: /play gbtm ;)";

    // Send the message, mentioning the member
    generalChannel.send(`Welcome to the server, ${member}.\n` + rules_string);

    sql.verifyUser(member, () => {});
});

// voiceStateUpdate
/* Emitted whenever a user changes voice state - e.g. joins/leaves a channel, mute/unmute.
PARAMETER    TYPE             DESCRIPTION
oldMember    GuildMember      The member before the voice state update
newMember    GuildMember      The member after the voice state update    */
bot.on("voiceStateUpdate", async function (oldMember, newMember) {
    const sessionID = newMember.sessionID || oldMember.sessionID;

    // Check if sessionID is valid
    if (!sessionID) {
        log.logToDiscord(
            "No Session for both states",
            log.getDefaultChannel(newMember.guild),
            log.ERROR,
        );
        return;
    }
    // Assert member is not null
    if (!newMember.member) {
        log.logToDiscord(
            "Member Exception",
            log.getDefaultChannel(newMember.guild),
            log.ERROR,
        );
        return;
    }

    // if a bot
    if (newMember.member.user.bot) return;

    if (oldMember.channelID !== null && newMember.channelID === null) {
        // leave event
        sql.dbCloseVoiceLog(newMember.member, oldMember.channelID, sessionID);
    } else if (oldMember.channelID === null && newMember.channelID !== null) {
        // Join event
        sql.dbMakeVoiceLog(
            newMember.member,
            newMember.channelID,
            // @ts-ignore channel.name is valid
            newMember.channel.name,
            sessionID,
        );
    } else if (
        oldMember.channelID !== null &&
        newMember.channelID !== null &&
        oldMember.channelID !== newMember.channelID
    ) {
        // switch channels event
        sql.dbCloseVoiceLog(newMember.member, oldMember.channelID, sessionID);
        sql.dbMakeVoiceLog(
            newMember.member,
            newMember.channelID,
            // @ts-ignore channel.name is valid
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
bot.on("presenceUpdate", function (oldMember, newMember) {
    // Assert member is not null
    if (!newMember.member) {
        if (!newMember.guild) return;

        log.logToDiscord(
            "Member Exception",
            log.getDefaultChannel(newMember.guild),
            log.ERROR,
        );
        return;
    }

    // if a bot
    if (newMember.member.user.bot) return;

    // check that both members are valid
    if (!newMember || !oldMember) return;

    // remove any activities that aren't a game
    const new_activities = newMember.activities.filter(
        (act) => act.type === "PLAYING",
    );
    const old_activities = oldMember.activities.filter(
        (act) => act.type === "PLAYING",
    );

    // ensure its a change in activities
    if (new_activities.length === old_activities.length) return;

    const application = new_activities[0] || old_activities[0];

    // TODO: Replace with dictionaries of equivalent game ID's
    application.applicationID =
        application.applicationID === "356869127241072640"
            ? "401518684763586560"
            : application.applicationID;

    if (old_activities.length !== 0 && new_activities.length === 0) {
        // leave event
        sql.dbCloseGameLog(newMember.member, application);
    } else if (old_activities.length === 0 && new_activities.length !== 0) {
        // Join event
        sql.dbMakeGameLog(newMember.member, application);
    }
});

bot.on("shardError", (error) => {
    console.error("A websocket connection encountered an error:", error);
});

process.on("unhandledRejection", (error) => {
    console.error("Unhandled promise rejection:", error);
});

bot.login(process.env.DISCORD_LOGIN_TOKEN);
