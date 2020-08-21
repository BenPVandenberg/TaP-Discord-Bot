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
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
}

bot.on('ready', () => {
  console.log('This bot is online!');
});

bot.on('message', message => {
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

bot.on('shardError', error => {
  console.error('A websocket connection encountered an error:', error);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

bot.login(process.env.DISCORD_LOGIN_TOKEN);
