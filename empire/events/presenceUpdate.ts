import assert from 'assert';
import Discord from 'discord.js';
import * as log from '../utilities/log';
import * as sql from '../utilities/sql';
import config from '../config.json';

export default async function onPresenceUpdate(
  oldMember: Discord.Presence | null,
  newMember: Discord.Presence
) {
  // Assert member is not null
  if (!newMember.member) {
    assert(newMember.guild);

    log.logToDiscord('presenceUpdate: Member Exception', log.WARNING);
    return;
  }

  // if a bot
  if (newMember.member.user.bot) return;

  // check that both members are valid
  if (!newMember || !oldMember) return;

  // remove any activities that aren't a game
  const newActivities = newMember.activities.filter(
    (act) => act.type === 'PLAYING' && !config.ignore_games.includes(act.name)
  );
  const oldActivities = oldMember.activities.filter(
    (act) => act.type === 'PLAYING' && !config.ignore_games.includes(act.name)
  );

  for (const game of oldActivities) {
    // look for app in new_activities
    const search = newActivities.find((app) => app.name === game.name);
    if (search === undefined) {
      // no app in new presense, therefore close log
      await sql.dbCloseGameLog(newMember.member, game);
    }
  }

  for (const game of newActivities) {
    // look for app in old_activities
    const search = oldActivities.find((app) => app.name === game.name);
    if (search === undefined) {
      // no app in prev presense, therefore new log
      await sql.dbMakeGameLog(newMember.member, game);
    }
  }
}
