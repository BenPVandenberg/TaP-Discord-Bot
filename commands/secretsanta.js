const config = require("../config.json");
// secretsanta.js
// ========
module.exports = {
    name: "secretsanta",
    description: "adds or removes sombody from secret santa",
    // eslint-disable-next-line no-unused-vars
    execute(message, args) {
        const secret_santa_config = config.commands.secret_santa;

        if (!secret_santa_config.active) {
            message.reply("sorry you cannot join at this time.");
            return;
        }

        const roleToAdd = message.guild.roles.cache.get("770707823629697025"); // secret santa role

        const text_channel = message.guild.channels.cache.get(
            "770708204409585704",
        ); // secret santa text channel

        // if member already has the role
        if (message.member.roles.cache.has(roleToAdd.id)) {
            message.member.roles
                .remove(roleToAdd)
                .then(text_channel.send(`${message.member} has left.`));
        }
        // if member doesn't have the role
        else {
            message.member.roles
                .add(roleToAdd)
                .then(
                    text_channel.send(
                        `${message.member} has joined the Secret Santa!`,
                    ),
                );
        }
        message.react("👍");
    },
};
