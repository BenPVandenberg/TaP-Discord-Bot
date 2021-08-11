import Discord from "discord.js";
import assert from "assert";
import * as channels from "../utilities/channels";
import config from "../config.json";
// secretsanta.ts
// ========
module.exports = {
    name: "secretsanta",
    description: "adds or removes sombody from secret santa",
    admin: false,
    requireVoice: false,
    async execute(message: Discord.Message) {
        const secretSantaConfig = config.commands.secret_santa;

        if (!secretSantaConfig.active) {
            message.reply("sorry you cannot join at this time.");
            return;
        }

        assert(message.guild);
        const roleToAdd = message.guild.roles.cache.get(secretSantaConfig.role); // secret santa role

        const textChannel = channels.toTextChannel(
            message.guild.channels.cache.get(secretSantaConfig.role),
        ); // secret santa text channel

        assert(message.member);
        assert(roleToAdd);
        // if member already has the role
        if (message.member.roles.cache.has(roleToAdd.id)) {
            message.member.roles.remove(roleToAdd).then(() => {
                textChannel.send(`${message.member} has left.`);
            });
        }
        // if member doesn't have the role
        else {
            message.member.roles.add(roleToAdd).then(() => {
                textChannel.send(
                    `${message.member} has joined the Secret Santa!`,
                );
            });
        }
        message.react("👍");
    },
};
