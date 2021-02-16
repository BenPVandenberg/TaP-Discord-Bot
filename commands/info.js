const Discord = require('discord.js');
// info.js
// ========
module.exports = {
    name: 'info',
    description: 'gets info of a user',
    execute(message, args) { // eslint-disable-line no-unused-vars
        let rMember; // Takes the user mentioned, or the ID of a user

        try {
            rMember = message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0]));
        }
        catch (e) {
            return message.reply('usage: /info <@user | userid>');
        }

        if(!rMember) {return message.reply('Who that user? I dunno him.');} // if there is no user mentioned, or provided, it will say this

        const rUser = rMember.user;
        const micon = `https://cdn.discordapp.com/avatars/${ rMember.id }/${ rUser.avatar }.jpg`;

        let roles_display;
        try {
            roles_display = rMember._roles.map(r => `${message.guild.roles.cache.get(r).name}`).join(' | ') || '\u200B';
        }
        catch (e) {
            roles_display = '\u200B';
        }

        const member_embed = new Discord.MessageEmbed()
            .setDescription('__**Member Information**__')
            .setColor(rMember.displayHexColor)
            .setThumbnail(micon) // Their icon
            .addField('Name', `${rUser.username}#${rUser.discriminator}`)
            .addField('ID', rMember.id) // Their ID
            .addField('Status', rUser.presence.status)
            .addField('Joined at', rMember.joinedAt) // When they joined
            .addField('Roles', roles_display);

        message.channel.send(member_embed);
    },
};
