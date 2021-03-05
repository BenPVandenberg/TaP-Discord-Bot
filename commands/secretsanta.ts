import Discord from "discord.js";
import assert from "assert";
import * as channels from "../utilities/channels";
const config = require("../config.json");
// secretsanta.js
// ========
module.exports = {
    name: "secretsanta",
    description: "adds or removes sombody from secret santa",
    requireVoice: false,
    async execute(message: Discord.Message, args: string[]) {
        const secret_santa_config = config.commands.secret_santa;

        if (!secret_santa_config.active) {
            message.reply("sorry you cannot join at this time.");
            return;
        }

        assert(message.guild);
        const roleToAdd = message.guild.roles.cache.get("770707823629697025"); // secret santa role

        const text_channel = channels.toTextChannel(
            message.guild.channels.cache.get("770708204409585704"),
        ); // secret santa text channel

        assert(message.member);
        assert(roleToAdd);
        // if member already has the role
        if (message.member.roles.cache.has(roleToAdd.id)) {
            message.member.roles.remove(roleToAdd).then(() => {
                text_channel.send(`${message.member} has left.`);
            });
        }
        // if member doesn't have the role
        else {
            message.member.roles.add(roleToAdd).then(() => {
                text_channel.send(
                    `${message.member} has joined the Secret Santa!`,
                );
            });
        }
        message.react("👍");
    },
};
