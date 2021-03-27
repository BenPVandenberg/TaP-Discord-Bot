const express = require("express");
const fetch = require("node-fetch");
const btoa = require("btoa");

const router = express.Router();

const { CLIENT_ID, CLIENT_SECRET } = process.env;
const redirect = "https://localhost:5000/auth/callback";

// async/await error catcher
const catchAsync = (fn) => (req, res, next) => {
    const routePromise = fn(req, res, next);
    if (routePromise.catch) {
        routePromise.catch((err) => next(err));
    }
};

router.get("/login", (req, res) => {
    res.redirect(
        `https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${encodeURIComponent(
            redirect,
        )}`,
    );
});

router.get(
    "/callback",
    catchAsync(async (req, res) => {
        if (!req.query.code) throw new Error("NoCodeProvided");
        const { code } = req.query;
        const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
        const data = {
            grant_type: "authorization_code",
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
            redirect_uri: redirect,
            scope: "identify",
        };
        const response = await fetch(`https://discord.com/api/oauth2/token`, {
            method: "POST",
            headers: {
                Authorization: `Basic ${creds}`,
                "Content-type": `application/x-www-form-urlencoded`,
            },
            body: new URLSearchParams(data),
        });
        const json = await response.json();
        res.redirect(
            `http://localhost:3000/login` +
                `?access_token=${json.access_token}` +
                `&refresh_token=${json.refresh_token}`,
            // `&token_type=${json.token_type}`,
        );
    }),
);

module.exports = router;
