import Discord from "discord.js";
// echo.js
// ========
module.exports = {
    name: "ping",
    description: "pong!",
    admin: false,
    requireVoice: false,
    async execute(message: Discord.Message, args: string[]) {
        message.channel.send("pong!");
    },
};
