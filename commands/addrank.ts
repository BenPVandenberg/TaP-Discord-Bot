import assert from "assert";
import Discord from "discord.js";
import config from "../config.json";
import * as log from "../utilities/log";
import { isAdmin } from "../utilities/sql";

// addrank.ts
// ========
module.exports = {
    name: "addrank",
    description: "Manage users game ranks",
    admin: false,
    requireVoice: false,
    async execute(message: Discord.Message, args: string[]) {
        const rankConfig = config.commands.rank;
        const userIsAdmin = isAdmin(message.member);
        let memberToEdit = message.member;

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

        let mentionedUserList = message.mentions.members;
        if (mentionedUserList) {
            let mentionedUser = mentionedUserList.first();
            if (mentionedUser) {
                memberToEdit = mentionedUser;
                args.shift();
            }
        }

        // user gave a rank
        const rankToAdd = args.join(" ").toLowerCase().trim();

        try {
            if (rankConfig.free_ranks.includes(rankToAdd) || userIsAdmin) {
                assert(message.guild !== null);
                // is is a role we can manipulate
                const roleToAdd = message.guild.roles.cache.find(
                    (role) => role.name.toLowerCase() === rankToAdd,
                );

                // if member already has the role
                assert(memberToEdit instanceof Discord.GuildMember);
                assert(roleToAdd instanceof Discord.Role);

                if (memberToEdit.roles.cache.has(roleToAdd.id)) {
                    message.reply(`User already has ${roleToAdd.name} rank!`);
                }
                // if member doesn't have the role
                else {
                    memberToEdit.roles
                        .add(roleToAdd)
                        .then(() => {
                            message.reply(
                                `Successfully added ${roleToAdd.name} to your ranks!`,
                            );
                        })
                        .catch((err) => {
                            assert(memberToEdit instanceof Discord.GuildMember);
                            message.reply(
                                `Unable to add ${roleToAdd.name} to ${memberToEdit.nickname}.`,
                            );
                            throw err;
                        });
                }
            } else {
                message.reply(`${rankToAdd} is not a role I can assign.`);
            }
        } catch (err) {
            log.logToDiscord(err, log.WARNING);
            console.warn(err);
        }
    },
};
