const Discord = require('discord.js');
// info.js
// ========
module.exports = {
  name: 'info',
  description: 'gets info of a user',
  execute(message, args) { // eslint-disable-line no-unused-vars
    const rMember = message.guild.member(message.mentions.users.first()); // Takes the user mentioned, or the ID of a user

    if(!rMember) {return message.reply('Who that user? I dunno him.');} // if there is no user mentioned, or provided, it will say this

    const rUser = message.mentions.users.first();
    const micon = `https://cdn.discordapp.com/avatars/${ rMember.id }/${ rUser.avatar }.jpg`;

    let roles_display;
    try {
      roles_display = rMember._roles.map(r => `${message.guild.roles.cache.get(r).name}`).join(' | ');
    }
    catch (e) {
      roles_display = 'No Roles';
    }

    const memberembed = new Discord.MessageEmbed()
      .setDescription('__**Member Information**__')
      .setColor(rMember.displayHexColor)
      .setThumbnail(micon) // Their icon
      .addField('Name', `${rUser.username}#${rUser.discriminator}`)
      .addField('ID', rMember.id) // Their ID
      .addField('Status', rUser.presence.status)
      .addField('Joined at', rMember.joinedAt) // When they joined
      .addField('Roles', roles_display);

    message.channel.send(memberembed);
  },
};
