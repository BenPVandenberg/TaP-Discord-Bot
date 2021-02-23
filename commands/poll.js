const Discord = require("discord.js");
// poll.js
// ========
module.exports = {
    name: "poll",
    description: "creates a poll",
    execute(message, args) {
        message.delete();

        if (!args.length) {
            return message.reply("A poll message is required");
        }

        const pollDescription = args.join(" ");

        const poll_embed = new Discord.MessageEmbed()
            .setTitle(`**${pollDescription}**`)
            .setColor(message.member.displayHexColor)
            .setFooter(`Asked By: ${message.member.displayName}`);

        return message.channel.send(poll_embed).then(async (pollMessage) => {
            await pollMessage.react("👍");
            await pollMessage.react("👎");
        });
    },
};
