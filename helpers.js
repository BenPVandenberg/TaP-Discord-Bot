module.exports = {
    getRandomColor() {
        const h = (360 * Math.random()) / 360;
        const s = (100 * Math.random()) / 100;
        const l = (30 + 70 * Math.random()) / 100;
        let r, g, b;
        if (s === 0) {
            r = g = b = l; // achromatic
        }
        else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        const toHex = (x) => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    },

    makeSQLQuery(query, callback) {
        const mysql = require('mysql2');

        const con = mysql.createPool({
            connectionLimit: 10,
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: 'Discord_Bot',
        });

        con.query('SET time_zone = "EST";', function(err) {
            if (err) throw err;

            con.query(query, function(err) {
                if (err) throw err;
                return callback();
            });
        });
    },

    verifyUser(user, callback) {
        try {
            this.makeSQLQuery(
                `INSERT IGNORE INTO User (UserID, DisplayName, UserName, Discriminator) VALUES (${user.id}, "${user.displayName}", "${user.user.username}", ${user.user.discriminator});`,
                () => {
                    this.makeSQLQuery(`UPDATE User SET DisplayName = "${user.displayName}", UserName = "${user.user.username}", Discriminator = ${user.user.discriminator} WHERE UserID = ${user.id}`, () => {
                        callback();
                    });
                },
            );
        }
        catch (e) {
            console.error(e);
        }
    },

    dbMakeSoundLog(soundName, requestor) {
        try {
            this.verifyUser(requestor, () => {
                this.makeSQLQuery(
                    `INSERT IGNORE INTO Sound (SoundName) VALUES ('${soundName}');`,
                    () => {
                        this.makeSQLQuery(
                            `INSERT IGNORE INTO PlayLog (Requestor, SoundName) VALUES (${requestor.id}, '${soundName}');`,
                            () => {
                                return;
                            },
                        );
                    },
                );
            });
        }
        catch (e) {
            console.error(e);
        }
    },
    dbMakeGameLog(user, game) {
        try {
            this.verifyUser(user, () => {
                this.makeSQLQuery(
                    `INSERT IGNORE INTO Game (Title, GameID) VALUES ("${game.name}", ${game.applicationID});`,
                    () => {
                        this.makeSQLQuery(
                            `INSERT IGNORE INTO GameLog (UserID, Game) VALUES (${user.id}, "${game.name}");`,
                            () => {
                                return;
                            },
                        );
                    },
                );
            });
        }
        catch (e) {
            console.error(e);
        }
    },
    dbCloseGameLog(user, game) {
        try {
            this.verifyUser(user, () => {
                this.makeSQLQuery(
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
        }
        catch (e) {
            console.error(e);
        }
    },
    dbMakeVoiceLog(user, channelID, channelName, sessionID) {
        try {
            this.verifyUser(user, () => {
                this.makeSQLQuery(
                    `INSERT IGNORE INTO VoiceSession (SessionID, UserID) VALUES ('${sessionID}', ${user.id});`,
                    () => {
                        this.makeSQLQuery(
                            `INSERT IGNORE INTO VoiceChannel (ChannelID, ChannelName) VALUES (${channelID}, '${channelName}');`,
                            () => {
                                this.makeSQLQuery(
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
        }
        catch (e) {
            console.error(e);
        }
    },
    dbCloseVoiceLog(user, channelID, sessionID) {
        try {
            this.verifyUser(user, () => {
                this.makeSQLQuery(
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
        }
        catch (e) {
            console.error(e);
        }
    },
};
