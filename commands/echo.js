// echo.js
// ========
module.exports = {
    name: "echo",
    description: "echos the message given",
    execute(message, args) {
        message.delete();
        const echoTest = args.join(" ");
        return message.channel.send(echoTest);
    },
};
