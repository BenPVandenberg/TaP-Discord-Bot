import Discord from "discord.js";
import * as mysql from "mysql2/promise";
import * as log from "./log";

abstract class PoolClass {
    // set pool as undefined to start
    private static connectionPool: mysql.Pool | undefined = undefined;

    public static getPool(): mysql.Pool | undefined {
        // if the pool is undefined see if we can connect
        if (
            !this.connectionPool &&
            process.env.DB_HOST &&
            process.env.DB_USER
            // password not a required parameter
        ) {
            // if yes set the pool to the new object
            this.connectionPool = mysql.createPool({
                connectionLimit: 10,
                host: process.env.DB_HOST,
                user: process.env.DB_USER,
                password: process.env.DB_PASSWORD,
                database: "Discord_Bot",
            });
        }

        return this.connectionPool;
    }
}

export async function makeSQLQuery(query: string) {
    const sqlConnectionPool = PoolClass.getPool();
    if (sqlConnectionPool) {
        await sqlConnectionPool.query('SET time_zone = "EST";');
        return await sqlConnectionPool.query(query);
    }
}

export async function verifyUser(user: Discord.GuildMember) {
    try {
        await makeSQLQuery(
            "INSERT IGNORE INTO User (UserID, DisplayName, UserName, Discriminator) " +
                `VALUES (${user.id}, "${user.displayName}", "${user.user.username}", ${user.user.discriminator});`,
        );
        await makeSQLQuery(
            "UPDATE User SET " +
                `DisplayName = "${user.displayName}", ` +
                `UserName = "${user.user.username}", ` +
                `Discriminator = ${user.user.discriminator} ` +
                `WHERE UserID = ${user.id}`,
        );
    } catch (e) {
        log.logToDiscord(e, log.ERROR);
        console.error(e);
    }
}

export async function dbMakeSoundLog(
    soundName: string,
    requestor: Discord.GuildMember,
) {
    try {
        await verifyUser(requestor);
        await makeSQLQuery(
            `INSERT IGNORE INTO Sound (SoundName) ` +
                `VALUES ('${soundName}');`,
        );
        await makeSQLQuery(
            `INSERT IGNORE INTO PlayLog (Requestor, SoundName) ` +
                `VALUES (${requestor.id}, '${soundName}');`,
        );
    } catch (e) {
        log.logToDiscord(e, log.ERROR);
        console.error(e);
    }
}

export async function dbMakeGameLog(
    user: Discord.GuildMember,
    game: Discord.Activity,
) {
    try {
        await verifyUser(user);
        await makeSQLQuery(
            `INSERT IGNORE INTO Game (Title, GameID) ` +
                `VALUES ("${game.name}", ${game.applicationID});`,
        );
        await makeSQLQuery(
            `UPDATE Game SET GameID = ${game.applicationID} ` +
                `WHERE Title = "${game.name}";`,
        );
        await makeSQLQuery(
            `INSERT IGNORE INTO GameLog (UserID, Game) ` +
                `VALUES (${user.id}, "${game.name}");`,
        );
    } catch (e) {
        log.logToDiscord(e, log.ERROR);
        console.error(e);
    }
}

export async function dbCloseGameLog(
    user: Discord.GuildMember,
    game: Discord.Activity,
) {
    try {
        await verifyUser(user);
        await makeSQLQuery(
            "UPDATE GameLog " +
                "SET End = NOW() " +
                "WHERE ID = " +
                "(SELECT ID FROM " +
                "(SELECT * FROM GameLog " +
                `WHERE (UserID = ${user.id}) AND ` +
                `(Game = "${game.name}") ` +
                "ORDER BY Start DESC LIMIT 1) AS Sub " +
                "WHERE (End IS NULL)" +
                ");",
        );
    } catch (e) {
        log.logToDiscord(e, log.ERROR);
        console.error(e);
    }
}

export async function dbMakeVoiceLog(
    user: Discord.GuildMember,
    channelID: string,
    channelName: string,
    sessionID: string,
) {
    try {
        await verifyUser(user);
        await makeSQLQuery(
            `INSERT IGNORE INTO VoiceSession (SessionID, UserID) ` +
                `VALUES ('${sessionID}', ${user.id});`,
        );
        await makeSQLQuery(
            `INSERT IGNORE INTO VoiceChannel (ChannelID, ChannelName) ` +
                `VALUES (${channelID}, '${channelName}');`,
        );
        await makeSQLQuery(
            `INSERT IGNORE INTO VoiceLog (SessionID, ChannelID) VALUES ` +
                `('${sessionID}', ${channelID});`,
        );
    } catch (e) {
        log.logToDiscord(e, log.ERROR);
        console.error(e);
    }
}

export async function dbCloseVoiceLog(
    user: Discord.GuildMember,
    channelID: string,
    sessionID: string,
) {
    try {
        await verifyUser(user);
        await makeSQLQuery(
            "UPDATE VoiceLog " +
                "SET End = NOW() " +
                "WHERE ID = " +
                "(SELECT ID FROM " +
                "(SELECT * FROM VoiceLog " +
                `WHERE (SessionID = '${sessionID}') AND ` +
                `(ChannelID = ${channelID}) ` +
                "ORDER BY Start DESC LIMIT 1) AS Sub " +
                "WHERE (End IS NULL));",
        );
    } catch (e) {
        log.logToDiscord(e, log.ERROR);
        console.error(e);
    }
}

export async function isAdmin(
    user: Discord.GuildMember | null,
): Promise<boolean> {
    if (!user) return false;
    try {
        await verifyUser(user);

        const result = await makeSQLQuery(
            `SELECT isAdmin FROM Discord_Bot.User where UserID = ${user.id};`,
        );
        // @ts-ignore
        return result[0][0].isAdmin === 1;
    } catch (e) {
        log.logToDiscord(e, log.ERROR);
        console.log(e);
        return false;
    }
}
