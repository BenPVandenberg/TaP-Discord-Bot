require("dotenv").config();
require("console-stamp")(console, { pattern: "dd/mm/yyyy HH:MM:ss.l" });
import { Client, Constants, Intents } from "discord.js";
import onGuildMemberAdd from "./events/guildMemberAdd";
import onMessage from "./events/message";
import onMessageReactionAdd from "./events/messageReactionAdd";
import onPresenceUpdate from "./events/presenceUpdate";
import onVoiceStateUpdate from "./events/voiceStateUpdate";
import * as log from "./utilities/log";
import startMaintainance from "./utilities/maintainance";

const { Events } = Constants;
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

/* Emitted when the client becomes ready to start working.    */
bot.on(Events.CLIENT_READY, () => {
    console.log("This bot is online!");
});

/* Emitted whenever a message is created.
PARAMETER      TYPE           DESCRIPTION
message        Message        The created message    */
bot.on(Events.MESSAGE_CREATE, onMessage);

/* Emitted whenever a user joins a guild.
PARAMETER     TYPE               DESCRIPTION
member        GuildMember        The member that has joined a guild    */
bot.on(Events.GUILD_MEMBER_ADD, onGuildMemberAdd);

/* Emitted whenever a user changes voice state - e.g. joins/leaves a channel, mute/unmute.
PARAMETER    TYPE             DESCRIPTION
oldMember    GuildMember      The member before the voice state update
newMember    GuildMember      The member after the voice state update    */
bot.on(Events.VOICE_STATE_UPDATE, onVoiceStateUpdate);

/* Emitted whenever a guild member's presence changes, or they change one of their details.
PARAMETER    TYPE               DESCRIPTION
oldMember    GuildMember        The member before the presence update
newMember    GuildMember        The member after the presence update    */
bot.on(Events.PRESENCE_UPDATE, onPresenceUpdate);

/* Emitted whenever a reaction is added to a message.
PARAMETER              TYPE                   DESCRIPTION
messageReaction        MessageReaction        The reaction object
user                   User                   The user that applied the emoji or reaction emoji     */
bot.on(Events.MESSAGE_REACTION_ADD, onMessageReactionAdd);

bot.on(Events.SHARD_ERROR, async (error) => {
    log.logToDiscord(`shardError: ${error.message}`, log.ERROR);
    console.error("A websocket connection encountered an error:", error);
});

process.on("unhandledRejection", async (error) => {
    log.logToDiscord(`unhandledRejection: ${error}`, log.ERROR);
    console.error("Unhandled promise rejection:", error);
});

// init maintainance loop on separate thread
startMaintainance();

bot.login(process.env.DISCORD_LOGIN_TOKEN);
