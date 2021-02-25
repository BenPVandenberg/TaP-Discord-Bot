import Discord from "discord.js";
import * as mysql from "mysql2";

abstract class PoolClass {
    public static connectionPool = mysql.createPool({
        connectionLimit: 10,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: "Discord_Bot",
    });
}

export function makeSQLQuery(query: string, callback: () => any) {
    PoolClass.connectionPool.query('SET time_zone = "EST";', function (err) {
        if (err) throw err;

        PoolClass.connectionPool.query(query, function (err) {
            if (err) throw err;
            return callback();
        });
    });
}

export function verifyUser(user: Discord.GuildMember, callback: () => void) {
    try {
        makeSQLQuery(
            `INSERT IGNORE INTO User (UserID, DisplayName, UserName, Discriminator) VALUES (${user.id}, "${user.displayName}", "${user.user.username}", ${user.user.discriminator});`,
            () => {
                makeSQLQuery(
                    `UPDATE User SET DisplayName = "${user.displayName}", UserName = "${user.user.username}", Discriminator = ${user.user.discriminator} WHERE UserID = ${user.id}`,
                    () => {
                        callback();
                    },
                );
            },
        );
    } catch (e) {
        console.error(e);
    }
}

export function dbMakeSoundLog(
    soundName: string,
    requestor: Discord.GuildMember,
) {
    try {
        verifyUser(requestor, () => {
            makeSQLQuery(
                `INSERT IGNORE INTO Sound (SoundName) VALUES ('${soundName}');`,
                () => {
                    makeSQLQuery(
                        `INSERT IGNORE INTO PlayLog (Requestor, SoundName) VALUES (${requestor.id}, '${soundName}');`,
                        () => {
                            return;
                        },
                    );
                },
            );
        });
    } catch (e) {
        console.error(e);
    }
}

export function dbMakeGameLog(
    user: Discord.GuildMember,
    game: Discord.Activity,
) {
    try {
        verifyUser(user, () => {
            makeSQLQuery(
                `INSERT IGNORE INTO Game (Title, GameID) VALUES ("${game.name}", ${game.applicationID});`,
                () => {
                    makeSQLQuery(
                        `INSERT IGNORE INTO GameLog (UserID, Game) VALUES (${user.id}, "${game.name}");`,
                        () => {
                            return;
                        },
                    );
                },
            );
        });
    } catch (e) {
        console.error(e);
    }
}

export function dbCloseGameLog(
    user: Discord.GuildMember,
    game: Discord.Activity,
) {
    try {
        verifyUser(user, () => {
            makeSQLQuery(
                `
        UPDATE GameLog
        SET End = NOW()
        WHERE ID =
        (
        SELECT ID FROM
          (SELECT * FROM GameLog
          WHERE (UserID = ${user.id}) AND
          (Game = "${game.name}")
          ORDER BY Start DESC LIMIT 1) AS Sub
        WHERE (End IS NULL)
        );`,
                () => {
                    return;
                },
            );
        });
    } catch (e) {
        console.error(e);
    }
}

export function dbMakeVoiceLog(
    user: Discord.GuildMember,
    channelID: string,
    channelName: string,
    sessionID: string,
) {
    try {
        verifyUser(user, () => {
            makeSQLQuery(
                `INSERT IGNORE INTO VoiceSession (SessionID, UserID) VALUES ('${sessionID}', ${user.id});`,
                () => {
                    makeSQLQuery(
                        `INSERT IGNORE INTO VoiceChannel (ChannelID, ChannelName) VALUES (${channelID}, '${channelName}');`,
                        () => {
                            makeSQLQuery(
                                `INSERT IGNORE INTO VoiceLog (SessionID, ChannelID) VALUES ('${sessionID}', ${channelID});`,
                                () => {
                                    return;
                                },
                            );
                        },
                    );
                },
            );
        });
    } catch (e) {
        console.error(e);
    }
}

export function dbCloseVoiceLog(
    user: Discord.GuildMember,
    channelID: string,
    sessionID: string,
) {
    try {
        verifyUser(user, () => {
            makeSQLQuery(
                `
        UPDATE VoiceLog
        SET End = NOW()
        WHERE ID =
        (
        SELECT ID FROM
          (SELECT * FROM VoiceLog
          WHERE (SessionID = '${sessionID}') AND
          (ChannelID = ${channelID})
          ORDER BY Start DESC LIMIT 1) AS Sub
        WHERE (End IS NULL)
        )`,
                () => {
                    return;
                },
            );
        });
    } catch (e) {
        console.error(e);
    }
}
