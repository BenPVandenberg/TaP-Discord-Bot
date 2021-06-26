const express = require("express");
const fs = require("fs");
const path = require("path");
const asyncHandler = require("express-async-handler");
const sql = require("../utilities/sql");

const router = express.Router();

/* GET sounds listing. */
router.get(
    "/",
    asyncHandler(async (req, res, next) => {
        const rtnDataArr = [];
        const [rows] = await sql.query("SELECT * FROM Discord_Bot.SoundStats;");
        if (rows.length === 0) {
            res.status(400).send({ msg: "DB reporting no sounds" });
            return;
        }

        rows.forEach((element) => {
            rtnDataArr.push({
                name: element.SoundName,
                occurrences: element.Occurrences,
                ownerID: element.OwnerID,
                ownerName: element.OwnerName,
                volume: element.Volume,
            });
        });

        res.status(200).send(rtnDataArr);
    }),
);

router.post(
    "/upload",
    asyncHandler(async (req, res, next) => {
        if (!req.files) {
            return res.status(400).send({ msg: "No file was uploaded" });
        }

        // accessing the file
        const myFile = req.files.file;
        const userID = req.body.user;

        if (!userID) {
            return res.status(401).send({ msg: "Must provide a user ID" });
        }

        const [validUsers] = await sql.query(
            "SELECT UserID FROM Discord_Bot.User;",
        );

        // eslint-disable-next-line eqeqeq
        const userIsValid = validUsers.some((el) => el.UserID == userID);
        if (!userIsValid) {
            return res
                .status(401)
                .send({ msg: "You are not authorized to upload sounds" });
        }

        // verify the file is valid
        if (!myFile.name.endsWith(".mp3") || myFile.mimetype !== "audio/mpeg") {
            return res.status(415).send({
                msg: "File uploaded isn't a correct format. Must be a .mp3 file",
            });
        }

        // check for spaces (it can't be played by the bot)
        if (myFile.name.indexOf(" ") !== -1) {
            return res
                .status(400)
                .send({ msg: "Spaces aren't permitted in the filename" });
        }

        const fullFilePath = path.join(
            process.env.SOUNDS_DIR,
            myFile.name.toLowerCase(),
        );

        // check if file already exists
        if (fs.existsSync(fullFilePath)) {
            return res.status(400).send({ msg: "That file already exists" });
        }

        const localName = myFile.name.slice(0, -4).toLowerCase();
        // add sound to the db
        try {
            await sql.query(
                `INSERT INTO Sound (SoundName, UploadDate, Owner) VALUES (?, CONVERT_TZ(NOW(), 'UTC', 'America/New_York'), ?);`,
                [localName, userID || null],
            );
        } catch (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res
                    .status(409)
                    .send({ msg: "That file already exists in the database" });
            }
        }

        // all checks are done now to add the sound
        // mv() method places the file inside public directory
        myFile.mv(fullFilePath, (err) => {
            if (err) {
                return res.status(500).send({
                    msg: "Error occurred: Unable to move file to bot dir",
                });
            }
        });

        // returning the response with file name
        return res.status(201).send({
            fileName: myFile.name.toLowerCase(),
            name: localName,
        });
    }),
);

module.exports = router;
