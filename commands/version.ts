import Discord from "discord.js";
import { version } from "../package.json";
// version.ts
// ========
module.exports = {
    name: "version",
    description: "Displays bot version",
    alias: ["v"],
    admin: false,
    requireVoice: false,
    async execute(message: Discord.Message) {
        message.channel.send(`v${version}`);
    },
};
