const express = require("express");

const router = express.Router();
const asyncHandler = require("express-async-handler");
const sql = require("../utilities/sql");

/* GET data listing. */
router.get(
    "/:file",
    asyncHandler(async (req, res, next) => {
        // send contents of data file
        const rtnDataArr = [];
        let rows = [];
        switch (req.params.file) {
            case "game":
                rows = await sql.query(
                    "SELECT UserID, Username, Game, Start, End FROM GameLogsView;",
                );
                rows[0].forEach((element) => {
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
                break;

            case "voice":
                rows = await sql.query(
                    "SELECT UserID, Username, Channel, Start, End FROM VoiceLogsView;",
                );
                rows[0].forEach((element) => {
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
                break;

            default:
                res.status(404).send();
                break;
        }
    }),
);

module.exports = router;
