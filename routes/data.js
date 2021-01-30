const express = require('express');

const router = express.Router();
const fs = require('fs');
const mysql = require('mysql');

const con = mysql.createConnection({
  host: process.env.DB_ADDRESS,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'Discord_Bot',
  timezone: 'EST',
});

/* GET data listing. */
router.get('/:file', (req, res, next) => {
  // send contents of data file
  try {
    const rtnDataDict = {};
    const rtnDataArr = [];
    switch (req.params.file) {
      case 'play':
        con.query(
          'SELECT SoundName, Count(*) AS Occurrences FROM Discord_Bot.PlayLog GROUP BY SoundName;',
          (err, result) => {
            if (err) res.status(400).send({ msg: err.message });

            result.forEach((element) => {
              rtnDataDict[element.SoundName] = element.Occurrences;
            });

            res.status(200).send(rtnDataDict);
          },
        );
        return;

      case 'game':
        con.query(
          'SELECT UserID, Username, Game, Start, End FROM User natural join GameLog ORDER BY Start DESC;',
          (err, result) => {
            if (err) res.status(400).send({ msg: err.message });

            result.forEach((element) => {
              rtnDataArr.push({
                userID: element.UserID,
                username: element.Username,
                game: element.Game,
                start: element.Start,
                end: element.End,
              });
            });

            res.status(200).send(rtnDataArr);
          },
        );
        return;

      default:
        return res.status(404);
    }
  } catch (e) {
    res.status(400).send({ msg: e.message });
  }
});

module.exports = router;
