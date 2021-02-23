const Discord = require("discord.js");
const config = require("../config.json");
// addrank.js
// ========
module.exports = {
    name: "addrank",
    description: "Manage users game ranks",
    execute(message, args) {
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
            arg = args[arg].toLowerCase();

            if (rank_config.free_ranks.includes(arg)) {
                // is is a role we can manipulate
                const roleToAdd = message.guild.roles.cache.find(
                    (role) => role.name.toLowerCase() === arg,
                );

                // if member already has the role
                if (message.member.roles.cache.has(roleToAdd.id)) {
                    message.reply(`User already has ${roleToAdd.name} rank!`);
                }
                // if member doesn't have the role
                else {
                    message.member.roles
                        .add(roleToAdd)
                        .then(
                            message.reply(
                                `Successfully added ${roleToAdd.name} to your ranks!`,
                            ),
                        )
                        .catch((err) => {
                            console.error(err);
                            message.reply(
                                `Unable to add ${roleToAdd.name} to ${message.member.nickname}.`,
                            );
                        });
                }
            } else {
                message.reply(`${arg} is not a role I can assign.`);
            }
        }
    },
};
