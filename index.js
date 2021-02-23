require("dotenv").config();
const fs = require("fs");
require("console-stamp")(console, { pattern: "dd/mm/yyyy HH:MM:ss.l" });
const Discord = require("discord.js");
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const config = require("./config.json");
const helpers = require("./helpers");

// find all commands
const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));
// add commands to bot
for (const file of commandFiles) {
    if (!["top10.js"].includes(file)) {
        const command = require(`./commands/${file}`);
        bot.commands.set(command.name, command);
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
    if (!message.guild && !message.author.bot) {
        message.reply(
            "Wow someone actually messaged me... don't like it, fuck off!",
        );
        return;
    }

    // update chief of military tactics' role colour
    const role = message.guild.roles.cache.get("674039470084849691");
    role.edit({
        color: helpers.getRandomColor(),
    });

    // check if it is a bot command in a non command channel
    const bot_cmd_channels = ["522935673964199936", "740332251103101048"];
    if (
        (message.content.startsWith(config.prefix) ||
            message.content.startsWith("-") ||
            message.author.bot) &&
        !bot_cmd_channels.includes(message.channel.id) &&
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
    const command = args.shift().toLowerCase();

    // check if the bot has the command
    if (!bot.commands.has(command)) return;

    // log command received
    console.log(
        `Command Received from ${message.member.user.username}: ${message.content}`,
    );

    try {
        bot.commands.get(command).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply("there was an error trying to execute that command!");
    }
});

// Create an event listener for new guild members
bot.on("guildMemberAdd", (member) => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(
        (ch) => ch.name === "general",
    );
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member

    const rules_string =
        "1. Be wary of the wild DeadAss + Grim, they DO bite! \n" +
        "2. This is NOT a democracy (RIP ur free will) \n" +
        '3. The President is "not racist" -President \n' +
        "4. Add game ranks by using /ranks \n" +
        "BONUS: /play gbtm ;)";

    channel.send(`Welcome to the server, ${member}.` + rules_string);

    helpers.verifyUser(member, () => {
        return;
    });
});

// voiceStateUpdate
/* Emitted whenever a user changes voice state - e.g. joins/leaves a channel, mute/unmute.
PARAMETER    TYPE             DESCRIPTION
oldMember    GuildMember      The member before the voice state update
newMember    GuildMember      The member after the voice state update    */
bot.on("voiceStateUpdate", async function (oldMember, newMember) {
    const sessionID = newMember.sessionID || oldMember.sessionID;

    // if a bot
    if (newMember.member.user.bot) return;

    if (oldMember.channelID != null && newMember.channelID == null) {
        // leave event
        helpers.dbCloseVoiceLog(
            newMember.member,
            oldMember.channelID,
            sessionID,
        );
    } else if (oldMember.channelID == null && newMember.channelID != null) {
        // Join event
        helpers.dbMakeVoiceLog(
            newMember.member,
            newMember.channelID,
            newMember.channel.name,
            sessionID,
        );
    } else if (
        oldMember.channelID != null &&
        newMember.channelID != null &&
        oldMember.channelID !== newMember.channelID
    ) {
        // switch channels event
        helpers.dbCloseVoiceLog(
            newMember.member,
            oldMember.channelID,
            sessionID,
        );
        helpers.dbMakeVoiceLog(
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
bot.on("presenceUpdate", function (oldMember, newMember) {
    // if the bot
    if (["738903340011749378", "234395307759108106"].includes(newMember.userID))
        return;

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
        helpers.dbCloseGameLog(newMember.member, application);
    } else if (old_activities.length === 0 && new_activities.length !== 0) {
        // Join event
        helpers.dbMakeGameLog(newMember.member, application);
    }
});

bot.on("shardError", (error) => {
    console.error("A websocket connection encountered an error:", error);
});

process.on("unhandledRejection", (error) => {
    console.error("Unhandled promise rejection:", error);
});

bot.login(process.env.DISCORD_LOGIN_TOKEN);
