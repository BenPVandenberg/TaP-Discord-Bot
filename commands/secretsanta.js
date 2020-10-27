// secretsanta.js
// ========
module.exports = {
  name: 'secretsanta',
  description: 'adds or removes sombody from secret santa',
  execute(message, args) { // eslint-disable-line no-unused-vars

    const roleToAdd = message.guild.roles.cache.get('770707823629697025'); // secret santa role

    const text_channel = message.guild.channels.cache.get('770708204409585704'); // secret santa text channel

    // if member already has the role
    if (message.member.roles.cache.has(roleToAdd.id)) {
      message.member.roles
        .remove(roleToAdd)
        .then(
          text_channel.send(`${ message.member } has left.`),
        );
    }
    // if member doesn't have the role
    else {
      message.member.roles
        .add(roleToAdd)
        .then(
          text_channel.send(`${ message.member } has joined the Secret Santa!`),
        );
    }
    message.react('👍');
  },
};
