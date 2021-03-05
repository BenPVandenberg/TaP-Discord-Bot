import Discord from "discord.js";
// echo.js
// ========
module.exports = {
    name: "echo",
    description: "echos the message given",
    requireVoice: false,
    async execute(message: Discord.Message, args: string[]) {
        message.delete();
        const echoTest = args.join(" ");
        return message.channel.send(echoTest);
    },
};
