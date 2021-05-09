const express = require("express");

const router = express.Router();
const fs = require("fs");
const mysql = require("mysql2");

const con = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_ADDRESS,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "Discord_Bot",
});

/* GET data listing. */
router.get("/:file", (req, res, next) => {
    // send contents of data file
    const rtnDataArr = [];
    switch (req.params.file) {
        case "play":
            con.query(
                "SELECT SoundName, Count(*) AS Occurrences, UserID as OwnerID, Username as OwnerName " +
                    "FROM PlayLog natural join Sound left join User on Owner = UserID GROUP BY SoundName;",
                (err, result) => {
                    if (err) {
                        res.status(400).send({ msg: err.message });
                        return;
                    }
                    if (result === undefined) {
                        res.status(400).send({ msg: "DB reporting no sounds" });
                        return;
                    }

                    result.forEach((element) => {
                        rtnDataArr.push({
                            name: element.SoundName,
                            occurrences: element.Occurrences,
                            ownerID: element.OwnerID,
                            ownerName: element.OwnerName,
                        });
                    });

                    res.status(200).send(rtnDataArr);
                },
            );
            break;

        case "game":
            con.query(
                "SELECT UserID, Username, Game, Start, End FROM GameLogsView;",
                (err, result) => {
                    if (err) res.status(400).send({ msg: err.message });

                    result.forEach((element) => {
                        rtnDataArr.push({
                            userID: element.UserID,
                            username: element.Username,
                            game: element.Game,
                            start: element.Start.toLocaleString(),
                            end: element.End
                                ? element.End.toLocaleString()
                                : element.End,
                        });
                    });

                    res.status(200).send(rtnDataArr);
                },
            );
            break;

        case "voice":
            con.query(
                "SELECT UserID, Username, Channel, Start, End FROM VoiceLogsView;",
                (err, result) => {
                    if (err) res.status(400).send({ msg: err.message });

                    result.forEach((element) => {
                        rtnDataArr.push({
                            userID: element.UserID,
                            username: element.Username,
                            channel: element.Channel,
                            start: element.Start.toLocaleString(),
                            end: element.End
                                ? element.End.toLocaleString()
                                : element.End,
                        });
                    });

                    res.status(200).send(rtnDataArr);
                },
            );
            break;

        default:
            res.status(404).send();
            break;
    }
});

module.exports = router;
