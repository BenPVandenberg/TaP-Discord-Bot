require('dotenv').config();
const fs = require('fs');
require('console-stamp')(console, { pattern: 'dd/mm/yyyy HH:MM:ss.l' });
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const config = require('./config.json');

// find all commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// add commands to bot
for (const file of commandFiles) {
  if (!['top10.js'].includes(file)) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
  }
}

bot.on('ready', () => {
  console.log('This bot is online!');
});

bot.on('message', async message => {
  // easter egg for dm's
  if (!message.guild && !message.author.bot) {
    message.reply('Wow someone actually messaged me... dont like it, fuck off!');
    return;
  }

  // update cheif of military tatics' role colour
  const role = message.guild.roles.cache.find(r => r.name === 'Cheif of Military Tactics');
  role.edit({
    color: getRandomColor(),
  });

  // check if it is a bot command in a non command channel
  const bot_cmd_channels = ['522935673964199936', '740332251103101048'];
  if ((message.content.startsWith(config.prefix) || message.content.startsWith('-') || message.author.bot) && !bot_cmd_channels.includes(message.channel.id)) {
    message.delete();
    return;
  }

  // check if it is a commannd for us, if not break
  if (!message.content.startsWith(config.prefix) || message.author.bot) {return;}

  // isolate command and args
  const args = message.content.slice(config.prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  // check if the bot has the command
  if (!bot.commands.has(command)) return;

  // log command recived
  console.log(`Command Recived from ${message.member.user.username}: ${message.content}`);

  try {
    bot.commands.get(command).execute(message, args);
  }
  catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }

});

// Create an event listener for new guild members
bot.on('guildMemberAdd', member => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.cache.find(ch => ch.name === 'general');
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member

  const rules_string = `1. Be wary of the wild Greenlizid + Grim, they DO bite!
2. This is NOT a democrocy (RIP ur free will)
3. The President is "not racist" -President
4. Add game ranks by using /ranks
BONUS: /play gbtm ;)`;

  channel.send(`Welcome to the server, ${member}. \n` + rules_string);
});

bot.on('shardError', error => {
  console.error('A websocket connection encountered an error:', error);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

bot.login(process.env.DISCORD_LOGIN_TOKEN);


function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
