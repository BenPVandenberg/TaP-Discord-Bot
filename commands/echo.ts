import Discord from "discord.js";
// echo.js
// ========
module.exports = {
    name: "echo",
    description: "echos the message given",
    alias: ["say"],
    admin: true,
    requireVoice: false,
    async execute(message: Discord.Message, args: string[]) {
        message.delete();
        const echoText = args.join(" ");
        return message.channel.send(echoText);
    },
};
