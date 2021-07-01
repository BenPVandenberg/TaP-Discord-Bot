import assert from "assert";
import Discord from "discord.js";
import * as log from "../utilities/log";
import * as sql from "../utilities/sql";
const config = require("../config.json");

export default async function onPresenceUpdate(
    oldMember: Discord.Presence | undefined,
    newMember: Discord.Presence,
) {
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
}
