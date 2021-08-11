import Discord from "discord.js";
import config from "../config.json";
// ranks.ts
// ========
module.exports = {
    name: "ranks",
    description: "Display all ranks T&P bot can give",
    admin: false,
    requireVoice: false,
    async execute(message: Discord.Message) {
        const rankConfig = config.commands.rank;

        // give user list of ranks
        // make string of ranks
        const allRanksString =
            "-" +
            rankConfig.free_ranks.join("\n-") +
            "\n\nUse with:\n/addrank or /removerank";

        const allRanksEmbedded = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .addField("All Server Ranks", allRanksString, false);

        return message.reply({ embeds: [allRanksEmbedded] });
    },
};
