import assert from "assert";
import Discord from "discord.js";
import * as log from "../utilities/log";
import * as sql from "../utilities/sql";

export default async function onVoiceStateUpdate(
    oldMember: Discord.VoiceState,
    newMember: Discord.VoiceState
) {
    const sessionID = newMember.sessionId ?? oldMember.sessionId;

    // Check if sessionID is valid
    if (!sessionID) {
        log.logToDiscord(
            "voiceStateUpdate: No Session for both states",
            log.WARNING
        );
        log.logToDiscord(`${{ oldMember, newMember }}`, log.DEBUG);
        return;
    }
    // Assert member is not null
    if (!newMember.member) {
        log.logToDiscord("voiceStateUpdate: Member Exception", log.WARNING);
        return;
    }

    // if a bot
    if (newMember.member.user.bot) return;

    if (oldMember.channelId !== null && newMember.channelId === null) {
        // leave event
        await sql.dbCloseVoiceLog(
            newMember.member,
            oldMember.channelId,
            sessionID
        );
    } else if (oldMember.channelId === null && newMember.channelId !== null) {
        // Join event
        assert(newMember.channel);
        await sql.dbMakeVoiceLog(
            newMember.member,
            newMember.channelId,
            newMember.channel.name,
            sessionID
        );
    } else if (
        oldMember.channelId !== null &&
        newMember.channelId !== null &&
        oldMember.channelId !== newMember.channelId
    ) {
        // switch channels event
        await sql.dbCloseVoiceLog(
            newMember.member,
            oldMember.channelId,
            sessionID
        );
        assert(newMember.channel);
        await sql.dbMakeVoiceLog(
            newMember.member,
            newMember.channelId,
            newMember.channel.name,
            sessionID
        );
    }
}
