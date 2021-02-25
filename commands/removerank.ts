import Discord from "discord.js";
import assert from "assert";
const config = require("../config.json");
// removerank.js
// ========
module.exports = {
    name: "removerank",
    description: "Manage users game ranks",
    execute(message: Discord.Message, args: string[]) {
        const rank_config = config.commands.rank;

        // give user list of ranks
        if (!args.length) {
            // make string of ranks
            const all_ranks_string = "-" + rank_config.free_ranks.join("\n-");

            const all_ranks_embeded = new Discord.MessageEmbed()
                .setColor("#0099ff")
                .addField("All Server Ranks", all_ranks_string, false);

            message.reply(all_ranks_embeded);
            return;
        }

        // user gave some ranks, lets go through them
        for (let arg in args) {
            assert(message.guild);
            assert(message.member);
            arg = args[arg].toLowerCase();

            if (rank_config.free_ranks.includes(arg)) {
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
