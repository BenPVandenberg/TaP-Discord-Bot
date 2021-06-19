const express = require("express");
const asyncHandler = require("express-async-handler");
const sql = require("../utilities/sql");

const router = express.Router();

/* GET sounds listing. */
router.get(
    "/",
    asyncHandler(async (req, res, next) => {
        const { id } = req.query;
        if (!id) {
            res.status(400).send({ msg: "No id provided" });
            return;
        }

        const [rows] = await sql.query(
            "SELECT * FROM Discord_Bot.User where UserID = ?;",
            [id],
        );
        if (rows.length === 0) {
            res.status(400).send({ msg: "No user matches that ID" });
            return;
        }

        res.status(200).send({
            userID: rows[0].UserID,
            displayName: rows[0].DisplayName,
            username: rows[0].Username,
            discriminator: rows[0].Discriminator,
            isAdmin: rows[0].isAdmin === 1,
        });
    }),
);

module.exports = router;
