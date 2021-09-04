const express = require("express");
const asyncHandler = require("express-async-handler");
const sql = require("../utilities/sql");

const router = express.Router();

const userExists = async (id) => {
    const [rows] = await sql.query(
        "SELECT * FROM Discord_Bot.User where UserID = ?;",
        [id]
    );

    return rows.length !== 0;
};

function createDateAsUTC(date) {
    return new Date(
        Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
            date.getSeconds()
        )
    );
}

// using a username search for a matching user as return their info
router.get(
    "/search",
    asyncHandler(async (req, res, next) => {
        const { username } = req.query;
        if (!username) {
            res.status(400).send({ msg: "No username provided" });
            return;
        }

        // get user info
        const [rows] = await sql.query(
            "SELECT * FROM Discord_Bot.User where Username = ?;",
            [username]
        );

        if (rows.length === 0) {
            res.status(400).send({ msg: "No users match that username" });
            return;
        }

        res.status(200).send({
            userID: rows[0].UserID,
            displayName: rows[0].DisplayName,
            username: rows[0].Username,
            discriminator: rows[0].Discriminator,
            isAdmin: rows[0].isAdmin === 1,
        });
    })
);

// get user info based on user ID
router.get(
    "/:id",
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        if (!id) {
            res.status(400).send({ msg: "No id provided" });
            return;
        }

        // verify we got a valid id
        if (!(await userExists(id))) {
            res.status(400).send({ msg: "No user matches that ID" });
            return;
        }

        // get user info
        const [rows] = await sql.query(
            "SELECT * FROM Discord_Bot.User where UserID = ?;",
            [id]
        );

        res.status(200).send({
            userID: rows[0].UserID,
            displayName: rows[0].DisplayName,
            username: rows[0].Username,
            discriminator: rows[0].Discriminator,
            isAdmin: rows[0].isAdmin === 1,
        });
    })
);

// get a users game logs from their id
router.get(
    "/:id/game",
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        if (!id) {
            res.status(400).send({ msg: "No id provided" });
            return;
        }

        // verify we got a valid id
        if (!(await userExists(id))) {
            res.status(400).send({ msg: "No user matches that ID" });
            return;
        }

        const [rows] = await sql.query(
            "CALL `Discord_Bot`.`usp_getGameLogs`(?);",
            [id]
        );

        // convert responce to array to be sent
        const rtnDataArr = [];
        rows[0].forEach((element) => {
            rtnDataArr.push({
                userID: element.UserID,
                username: element.Username,
                game: element.Game,
                start: createDateAsUTC(element.Start),
                end: createDateAsUTC(element.End),
            });
        });

        res.status(200).send(rtnDataArr);
    })
);

// get a voice game logs from their id
router.get(
    "/:id/voice",
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        if (!id) {
            res.status(400).send({ msg: "No id provided" });
            return;
        }

        // verify we got a valid id
        if (!(await userExists(id))) {
            res.status(400).send({ msg: "No user matches that ID" });
            return;
        }

        const [rows] = await sql.query(
            "CALL `Discord_Bot`.`usp_getVoiceLogs`(?);",
            [id]
        );

        // convert responce to array to be sent
        const rtnDataArr = [];
        rows[0].forEach((element) => {
            rtnDataArr.push({
                userID: element.UserID,
                username: element.Username,
                channel: element.Channel,
                start: element.Start.toLocaleString(),
                end: element.End ? element.End.toLocaleString() : element.End,
            });
        });

        res.status(200).send(rtnDataArr);
    })
);

module.exports = router;
