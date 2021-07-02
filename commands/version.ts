import Discord from "discord.js";
const { version } = require("../package.json");
// version.ts
// ========
module.exports = {
    name: "version",
    description: "Displays bot version",
    alias: ["v"],
    admin: false,
    requireVoice: false,
    async execute(message: Discord.Message, _args: string[]) {
        message.channel.send(`T&P Bot v${version}`);
    },
};
