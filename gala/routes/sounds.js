const express = require("express");
const fs = require("fs");
const path = require("path");
const sql = require("../utilities/sql");

const router = express.Router();

/* GET sounds listing. */
router.get("/", (req, res, next) => {
    // send contents of sounds folder
    const rawData = fs.readdirSync(process.env.SOUNDS_DIR);
    res.status(200).send(rawData);
});

router.post("/upload", (req, res, next) => {
    if (!req.files) {
        return res.status(400).send({ msg: "No file was uploaded" });
    }

    // accessing the file
    const myFile = req.files.file;
    const userID = req.body.user;

    // verify the file is valid
    if (!myFile.name.endsWith(".mp3") || myFile.mimetype !== "audio/mpeg") {
        return res.status(400).send({
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

    // all checks are done now to add the sound
    // mv() method places the file inside public directory
    myFile.mv(fullFilePath, (err) => {
        if (err) {
            return res.status(500).send({
                msg: "Error occurred: Unable to move file to bot dir",
            });
        }
    });
    const localName = myFile.name.slice(0, -4).toLowerCase();

    // add sound to the db
    sql.query(`INSERT INTO Sound (SoundName, Owner) VALUES (?, ?);`, [
        localName,
        userID || null,
    ]);

    // returning the response with file name
    return res.status(201).send({
        fileName: myFile.name.toLowerCase(),
        name: localName,
    });
});

module.exports = router;
