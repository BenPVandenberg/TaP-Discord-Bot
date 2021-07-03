import Discord from "discord.js";
import assert from "assert";
const config = require("../config.json");
// removerank.ts
// ========
module.exports = {
    name: "removerank",
    description: "Manage users game ranks",
    admin: false,
    requireVoice: false,
    async execute(message: Discord.Message, args: string[]) {
        const rankConfig = config.commands.rank;

        // give user list of ranks
        if (!args.length) {
            // make string of ranks
            const allRanksString = "-" + rankConfig.free_ranks.join("\n-");

            const allRanksEmbeded = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .addField("All Server Ranks", allRanksString, false);

            message.reply({ embeds: [allRanksEmbeded] });
            return;
        }

        // user gave some ranks, lets go through them
        for (let arg in args) {
            assert(message.guild);
            assert(message.member);
            arg = args[arg].toLowerCase();

            if (rankConfig.free_ranks.includes(arg)) {
                // is is a role we can manipulate
                const roleToAdd = message.guild.roles.cache.find(
                    (role) => role.name.toLowerCase() === arg,
                );
                assert(roleToAdd);

                // if member already has the role
                if (message.member.roles.cache.has(roleToAdd.id)) {
                    message.member.roles
                        .remove(roleToAdd)
                        .then(() => {
                            message.reply(
                                `Successfully removed ${roleToAdd.name} from your ranks!`,
                            );
                        })
                        .catch(() => {
                            message.reply(
                                `Unable to remove ${arg} from ${roleToAdd.name}`,
                            );
                        });
                }
                // if member doesn't have the role
                else {
                    message.reply(`User doesn't have ${roleToAdd.name} rank!`);
                }
            } else {
                message.reply("that's not a role I can remove.");
            }
        }
    },
};
