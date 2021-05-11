const express = require("express");
const fetch = require("node-fetch");
const FormData = require("form-data");
const btoa = require("btoa");
const asyncHandler = require("express-async-handler");

const { CLIENT_ID, CLIENT_SECRET } = process.env;
const redirect = process.env.DISCORD_CALLBACK_URL;

const router = express.Router();

router.get("/login", (req, res) => {
    res.redirect(
        `https://discordapp.com/api/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${encodeURIComponent(
            redirect,
        )}`,
    );
});

router.get(
    "/callback",
    asyncHandler(async (req, res) => {
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
            `${process.env.FRONTEND_URL}/login` +
                `?access_token=${json.access_token}` +
                `&refresh_token=${json.refresh_token}`,
        );
    }),
);

router.get(
    "/refresh",
    asyncHandler(async (req, res) => {
        const { refreshToken } = req.query;
        if (!refreshToken) {
            res.status(400).send("No refresh token provided");
        }
        const formData = new FormData();
        formData.append("client_id", CLIENT_ID);
        formData.append("client_secret", CLIENT_SECRET);
        formData.append("grant_type", "refresh_token");
        formData.append("refresh_token", refreshToken);
        const data = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            body: formData,
        });
        const resObj = await data.json();
        res.status(data.status).send({
            access_token: resObj.access_token,
            refresh_token: resObj.refresh_token,
        });
    }),
);

module.exports = router;
