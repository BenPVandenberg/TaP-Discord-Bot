import assert from "assert";
import Discord from "discord.js";

// poll.ts
// ========
module.exports = {
    name: "poll",
    description: "creates a poll",
    admin: false,
    requireVoice: false,
    async execute(message: Discord.Message, args: string[]) {
        assert(message.member);
        message.delete();

        if (!args.length) {
            return message.reply("A poll message is required");
        }

        const pollDescription = args.join(" ");

        const pollEmbed = new Discord.MessageEmbed()
            .setTitle(`**${pollDescription}**`)
            .setColor(message.member.displayHexColor)
            .setFooter(`Asked By: ${message.member.displayName}`);

        return message.channel
            .send({ embeds: [pollEmbed] })
            .then(async (pollMessage) => {
                await pollMessage.react("👍");
                await pollMessage.react("👎");
            });
    },
};
