const Discord = require('discord.js');
const config = require('../config.json');
// ranks.js
// ========
module.exports = {
  name: 'rank',
  description: 'Manage users game ranks',
  execute(message, args) {
    const rank_config = config.commands.rank;

    // give user list of ranks
    if (!args.length) {
      // make string of ranks
      const all_ranks_string = '-' + rank_config.free_ranks.join('\n-');

      const all_ranks_embeded = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .addField('All Server Ranks', all_ranks_string, false)
        .setTimestamp();

      message.reply(all_ranks_embeded);
      return;
    }

    // user gave some ranks, lets go through them
    for (const arg in args) {
      if (rank_config.free_ranks.includes(arg)) {
        // is is a role we can manipulate
        // if member already has the role
        if (message.member.roles.cache.some(role => role.name === arg)) {
          const role = message.guild.roles.find(t => t.name === arg);
          message.member.roles.remove(role);
        }
        // if member doesn't have the role
        else {
          const role = message.guild.roles.find(t => t.name === arg);
          message.member.roles.add(role);
        }
      }
    }
  },
};