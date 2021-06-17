import Discord from "discord.js";
const config = require("../config.json");
// ranks.js
// ========
module.exports = {
    name: "ranks",
    description: "Display all ranks T&P bot can give",
    requireVoice: false,
    async execute(message: Discord.Message, args: string[]) {
        const rank_config = config.commands.rank;

        // give user list of ranks
        // make string of ranks
        const all_ranks_string =
            "-" +
            rank_config.free_ranks.join("\n-") +
            "\n\nUse with:\n/addrank or /removerank";

        const all_ranks_embedded = new Discord.MessageEmbed()
            .setColor("#0099ff")
            .addField("All Server Ranks", all_ranks_string, false);

        return message.reply({ embeds: [all_ranks_embedded] });
    },
};
