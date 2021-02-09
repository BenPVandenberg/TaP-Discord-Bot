const express = require('express');
const mysql = require('mysql2');

const router = express.Router();

const con = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_ADDRESS,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'Discord_Bot',
});

/* GET sounds listing. */
router.get('/', (req, res, next) => {
    const rtnDataArr = [];
    con.query(
        'SELECT * FROM Discord_Bot.Suggestion;',
        (err, result) => {
            if (err) res.status(400).send({ msg: err.message });
            if (result === undefined) {
                res.status(200).send([]);
            }

            result.forEach((element) => {
                rtnDataArr.push({
                    author: element.Author,
                    message: element.Message,
                    timestamp: element.Timestamp,
                });
            });

            res.status(200).send(rtnDataArr);
        },
    );
});

router.post('/', (req, res, next) => {
    const { text } = req.body;
    // eslint-disable-next-line no-undef
    const author = BigInt(req.body.author);

    if (text.trim() === '') {
        res.status(400).send({ msg: 'Suggestion cannot be empty' });
        return;
    }

    con.query(
        'INSERT INTO Suggestion (Author, Message) VALUES (?, ?);', [text || 'NULL', text.trim()],
        (err, result) => {
            if (err && err.code === 'ER_NO_REFERENCED_ROW') {
                res.status(400).send({ msg: 'Invalid Author ID' });
            } else if (err) {
                res.status(400).send({ msg: err.message });
                return;
            }

            res.status(200).send();
        },
    );
});

module.exports = router;
