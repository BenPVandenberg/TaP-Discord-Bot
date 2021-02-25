import Discord from "discord.js";
// echo.js
// ========
module.exports = {
    name: "echo",
    description: "echos the message given",
    execute(message: Discord.Message, args: string[]) {
        message.delete();
        const echoTest = args.join(" ");
        return message.channel.send(echoTest);
    },
};
