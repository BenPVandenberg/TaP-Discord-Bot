import Discord from "discord.js";
import * as mysql from "mysql2/promise";
import * as log from "./log";

abstract class PoolClass {
    // set pool as undefined to start
    private static connectionPool: mysql.Pool | undefined = undefined;

    /**
     * Get/make a sql connection pool
     * @returns connection pool if possible
     */
    private static getPool(): mysql.Pool | undefined {
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

    /**
     * Make a query to the sql db
     * @param query
     * @param variables all variable(s) to be inserted into query
     * @returns Sql response
     */
    public static async makeSQLQuery(query: string, variables?: any) {
        const sqlConnectionPool = this.getPool();
        if (sqlConnectionPool) {
            return await sqlConnectionPool.query(query, variables);
        }
    }
}

/**
 * Verifies the user is in the db and updates their info
 * @param user
 */
export async function verifyUser(user: Discord.GuildMember) {
    try {
        await PoolClass.makeSQLQuery(
            "INSERT IGNORE INTO User (UserID, DisplayName, UserName, Discriminator) " +
                "VALUES (?, ?, ?, ?);",
            [
                user.id,
                user.displayName,
                user.user.username,
                user.user.discriminator,
            ]
        );
        await PoolClass.makeSQLQuery(
            "UPDATE User SET " +
                "DisplayName = ?, " +
                "UserName = ?, " +
                "Discriminator = ? " +
                "WHERE UserID = ?",
            [
                user.displayName,
                user.user.username,
                user.user.discriminator,
                user.id,
            ]
        );
    } catch (e) {
        log.logToDiscord(e, log.WARNING);
        console.warn(e);
    }
}

/**
 * Make a new sound log
 * @param soundName Name of the sound
 * @param requestor User that made the request to play the sound
 */
export async function dbMakeSoundLog(
    soundName: string,
    requestor: Discord.GuildMember
) {
    try {
        await verifyUser(requestor);
        await PoolClass.makeSQLQuery(
            "INSERT IGNORE INTO Sound (SoundName) VALUES (?);",
            [soundName]
        );
        await PoolClass.makeSQLQuery(
            "INSERT IGNORE INTO PlayLog (Requestor, SoundName) VALUES (?, ?);",
            [requestor.id, soundName]
        );
    } catch (e) {
        log.logToDiscord(e, log.WARNING);
        console.warn(e);
    }
}

/**
 * Make a new game log
 * @param user User to assign the activity to
 * @param game Game the user started
 */
export async function dbMakeGameLog(
    user: Discord.GuildMember,
    game: Discord.Activity
) {
    try {
        await verifyUser(user);
        await PoolClass.makeSQLQuery(
            "INSERT IGNORE INTO Game (Title, GameID) VALUES (?, ?);",
            [game.name.trim(), game.applicationId]
        );
        await PoolClass.makeSQLQuery(
            "UPDATE Game SET GameID = ? WHERE Title = ? AND GameID IS NULL;",
            [game.applicationId, game.name.trim()]
        );
        await PoolClass.makeSQLQuery(
            "INSERT IGNORE INTO GameLog (UserID, Game) VALUES (?, ?);",
            [user.id, game.name.trim()]
        );
    } catch (e) {
        log.logToDiscord(e, log.WARNING);
        console.warn(e);
    }
}

/**
 * Close a game log
 * @param user User to assign the activity to
 * @param game Game the user started
 */
export async function dbCloseGameLog(
    user: Discord.GuildMember,
    game: Discord.Activity
) {
    try {
        await verifyUser(user);
        await PoolClass.makeSQLQuery(
            "UPDATE GameLog " +
                "SET End = NOW() " +
                "WHERE ID = " +
                "(SELECT ID FROM " +
                "(SELECT * FROM GameLog " +
                "WHERE (UserID = ?) AND " +
                "(Game = ?) " +
                "ORDER BY Start DESC LIMIT 1) AS Sub " +
                "WHERE (End IS NULL)" +
                ");",
            [user.id, game.name.trim()]
        );
    } catch (e) {
        log.logToDiscord(e, log.WARNING);
        console.warn(e);
    }
}

/**
 * Make a new voice log
 * @param user User to assign the activity to
 * @param channelID Channel ID the user connected to
 * @param channelName Channel name the user connected to
 * @param sessionID User's current session ID
 */
export async function dbMakeVoiceLog(
    user: Discord.GuildMember,
    channelID: string,
    channelName: string,
    sessionID: string
) {
    try {
        await verifyUser(user);
        await PoolClass.makeSQLQuery(
            "INSERT IGNORE INTO VoiceSession (SessionID, UserID) " +
                "VALUES (?, ?);",
            [sessionID, user.id]
        );
        await PoolClass.makeSQLQuery(
            "INSERT IGNORE INTO VoiceChannel (ChannelID, ChannelName) " +
                "VALUES (?, ?);",
            [channelID, channelName]
        );
        await PoolClass.makeSQLQuery(
            "INSERT IGNORE INTO VoiceLog (SessionID, ChannelID) " +
                "VALUES (?, ?);",
            [sessionID, channelID]
        );
    } catch (e) {
        log.logToDiscord(e, log.WARNING);
        console.warn(e);
    }
}

/**
 * Close an existing voice log
 * @param user User to assign the activity to
 * @param channelID Channel ID the user disconnected to
 * @param sessionID User's current session ID
 */
export async function dbCloseVoiceLog(
    user: Discord.GuildMember,
    channelID: string,
    sessionID: string
) {
    try {
        await verifyUser(user);
        await PoolClass.makeSQLQuery(
            "UPDATE VoiceLog " +
                "SET End = NOW() " +
                "WHERE ID = " +
                "(SELECT ID FROM " +
                "(SELECT * FROM VoiceLog " +
                "WHERE (SessionID = ?) AND " +
                "(ChannelID = ?) " +
                "ORDER BY Start DESC LIMIT 1) AS Sub " +
                "WHERE (End IS NULL));",
            [sessionID, channelID]
        );
    } catch (e) {
        log.logToDiscord(e, log.WARNING);
        console.warn(e);
    }
}

/**
 * Checks to see if a user has admin privileges
 * @param user
 * @returns if the user is an admin
 */
export async function isAdmin(
    user: Discord.GuildMember | null
): Promise<boolean> {
    if (!user) return false;
    try {
        await verifyUser(user);

        const result = await PoolClass.makeSQLQuery(
            "SELECT isAdmin FROM Discord_Bot.User where UserID = ?;",
            [user.id]
        );
        if (result) {
            // @ts-ignore
            return result[0][0].isAdmin === 1;
        }

        return false;
    } catch (e) {
        log.logToDiscord(e, log.WARNING);
        console.warn(e);
        return false;
    }
}

/**
 * Gets a list of sounds that should be hidden
 * @returns Array of sounds that should be hidden
 */
export async function getHiddenSounds(): Promise<string[]> {
    try {
        const result = await PoolClass.makeSQLQuery(
            "SELECT SoundName FROM Discord_Bot.Sound where isHidden = True;"
        );

        const output: string[] = [];
        if (result && result.length > 0) {
            // @ts-ignore
            result[0].forEach((element) => {
                if (element) output.push(element.SoundName);
            });
        }

        // @ts-ignore
        return output;
    } catch (e) {
        log.logToDiscord(e, log.WARNING);
        console.warn(e);
        return [];
    }
}

/**
 * Gets the volume a sound should be played at
 * @param soundName Name of sound in db
 * @returns Volume to play sound at
 */
export async function getSoundVolume(soundName: string): Promise<number> {
    try {
        const result = await PoolClass.makeSQLQuery(
            "SELECT Volume FROM Discord_Bot.Sound where SoundName = ?;",
            [soundName]
        );
        if (result) {
            // @ts-ignore
            return result[0][0].Volume;
        }
        return 1;
    } catch (e) {
        log.logToDiscord(e, log.WARNING);
        console.warn(e);
        return 1;
    }
}
