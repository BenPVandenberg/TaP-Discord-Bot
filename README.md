# T&P-Discord-Bot

[![Netlify Status](https://api.netlify.com/api/v1/badges/6dc605e9-9e20-4ec9-bad2-f36ce8f1079b/deploy-status)](https://app.netlify.com/sites/tandp/deploys)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/570c26163c0c4e9ca72553d53eba29f1)](https://www.codacy.com/gh/BenPVandenberg/TaP-Discord-Bot/dashboard?utm_source=github.com&utm_medium=referral&utm_content=BenPVandenberg/TaP-Discord-Bot&utm_campaign=Badge_Grade)

## Structure

| Codebase |                      Description |
| :------- | -------------------------------: |
| empire   |                      Discord bot |
| envy     |                   React frontend |
| gala     | Express backend (decommissioned) |
| liberty  |                  Express backend |
| opal     |                            mySQL |

## How to run locally

### Empire

To run the bot, you need to have a discord app set up.

1. Copy the `.env.example` to a `.env` file.
2. Fill the required fields in the `.env` file.
3. Go over the `config.json` and update it to reflect your server.
4. Run `npm install` and `npm start`.

### Envy

1. Create a .env file following the example
2. Run `npm install` + `npm start`

### Gala + Liberty

1. Crate an SSL certificate with `openssl req -nodes -new -x509 -keyout server.key -out server.cert -days 358000`
2. Create a .env file following the example
3. Run `npm install` + `npm start`
