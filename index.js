require('dotenv').config();
const fs = require('fs');
require('console-stamp')(console, { pattern: 'dd/mm/yyyy HH:MM:ss.l' });
const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();
const config = require('./config.json');
const helpers = require('./helpers');

// find all commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// add commands to bot
for (const file of commandFiles) {
  if (!['top10.js'].includes(file)) {
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
  }
}

// create data dir if not present
if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}

// ready
/* Emitted when the client becomes ready to start working.    */
bot.on('ready', () => {
  console.log('This bot is online!');
});

// message
/* Emitted whenever a message is created.
PARAMETER      TYPE           DESCRIPTION
message        Message        The created message    */
bot.on('message', async message => {
  // easter egg for dm's
  if (!message.guild && !message.author.bot) {
    message.reply('Wow someone actually messaged me... dont like it, fuck off!');
    return;
  }

  // update cheif of military tatics' role colour
  const role = message.guild.roles.cache.get('674039470084849691');
  role.edit({
    color: helpers.getRandomColor(),
  });

  // check if it is a bot command in a non command channel
  const bot_cmd_channels = ['522935673964199936', '740332251103101048'];
  if ((message.content.startsWith(config.prefix) || message.content.startsWith('-') || message.author.bot)
      && !bot_cmd_channels.includes(message.channel.id)
      && message.author.username !== 'T&P Bot') {

    message.delete();
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

  const rules_string = `
1. Be wary of the wild Greenlizid + Grim, they DO bite!
2. This is NOT a democrocy (RIP ur free will)
3. The President is "not racist" -President
4. Add game ranks by using /ranks
BONUS: /play gbtm ;)`;

  channel.send(`Welcome to the server, ${member}.` + rules_string);
});

// voiceStateUpdate
/* Emitted whenever a user changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
PARAMETER    TYPE             DESCRIPTION
oldMember    GuildMember      The member before the voice state update
newMember    GuildMember      The member after the voice state update    */
bot.on('voiceStateUpdate', async function(oldMember, newMember) {
  const voice_data_path = 'data/voice.json';
  if(fs.existsSync(voice_data_path)) {
    const data = JSON.parse(fs.readFileSync(voice_data_path));
    const sessionID = newMember.sessionID || oldMember.sessionID;
    const today = (new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))).toISOString().split('T');
    const date = today[0];
    const time = today[1].split('.')[0];

    // if the bot
    if (['738903340011749378', '234395307759108106'].includes(newMember.id)) return;

    // make new entry if user not existing
    if (!data[newMember.id]) {
      data[newMember.id] = {};
      data[newMember.id].identity = {};
      data[newMember.id].sessions = [];
    }

    // update data
    data[newMember.id].identity.displayName = newMember.member.displayName;
    data[newMember.id].identity.username = newMember.member.user.username;
    data[newMember.id].identity.discriminator = newMember.member.user.discriminator;

    const sessions_list = data[newMember.id].sessions;
    // check if this session has an entry already
    if (sessions_list.length === 0 || sessions_list[sessions_list.length - 1].sessionID !== sessionID) {
      sessions_list.push({
        'sessionID': sessionID,
        'events': [],
      });
    }

    const events = sessions_list[sessions_list.length - 1].events;

    if (oldMember.channelID != null && newMember.channelID == null) {
      // leave event
      events.push({
        'type': 'leave',
        'timestamp': date + ' ' + time,
        'channelID': oldMember.channelID,
        'channelName': oldMember.channel.name,
      });
    }
    else if (oldMember.channelID == null && newMember.channelID != null) {
      // Join event
      events.push({
        'type': 'join',
        'timestamp': date + ' ' + time,
        'channelID': newMember.channelID,
        'channelName': newMember.channel.name,
      });
    }
    else if (oldMember.channelID != null && newMember.channelID != null && oldMember.channelID !== newMember.channelID) {
      // switch channels event
      events.push({
        'type': 'leave',
        'timestamp': date + ' ' + time,
        'channelID': oldMember.channelID,
        'channelName': oldMember.channel.name,
      });
      events.push({
        'type': 'join',
        'timestamp': date + ' ' + time,
        'channelID': newMember.channelID,
        'channelName': newMember.channel.name,
      });
    }

    // update file
    fs.writeFile(voice_data_path, JSON.stringify(data), (err) => {
      if (err) console.log(err);
    });

  }
  // file doesnt exist yet
  else {
    fs.writeFile(voice_data_path, '{}', (err) => {
      if (err) console.log(err);
      else console.log(`Successfully created "${ voice_data_path }"`);
    });
  }
});

// presenceUpdate
/* Emitted whenever a guild member's presence changes, or they change one of their details.
PARAMETER    TYPE               DESCRIPTION
oldMember    GuildMember        The member before the presence update
newMember    GuildMember        The member after the presence update    */
bot.on('presenceUpdate', function(oldMember, newMember) {
  const game_data_path = 'data/game.json';
  if(fs.existsSync(game_data_path)) {
    const data = JSON.parse(fs.readFileSync(game_data_path));
    const today = (new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }))).toISOString().split('T');
    const date = today[0];
    const time = today[1].split('.')[0];

    // if the bot
    if (['738903340011749378', '234395307759108106'].includes(newMember.userID)) return;

    // check that both members are valid
    if (!newMember || !oldMember) return;

    // remove any activities that arn't a game
    const new_activities = newMember.activities.filter(act => act.type === 'PLAYING');
    const old_activities = oldMember.activities.filter(act => act.type === 'PLAYING');

    // ensure its a change in activities
    if (new_activities.length === old_activities.length) return;

    // make new entry if user not existing
    if (!data[newMember.userID]) {
      data[newMember.userID] = {};
      data[newMember.userID].identity = {};
      data[newMember.userID].gameLogs = {};
    }

    // update data
    data[newMember.userID].identity.displayName = newMember.member.displayName;
    data[newMember.userID].identity.username = newMember.member.user.username;
    data[newMember.userID].identity.discriminator = newMember.member.user.discriminator;

    const application = new_activities[0] || old_activities[0];
    application.applicationID = application.applicationID === '356869127241072640' ? '401518684763586560' : application.applicationID;

    if (!(application.applicationID in data[newMember.userID].gameLogs) && !(application.name in data[newMember.userID].gameLogs)) {
      data[newMember.userID].gameLogs[application.applicationID || application.name] = {
        'name': application.name,
        'events': [],
      };
    }

    const events = data[newMember.userID].gameLogs[application.applicationID || application.name].events;

    if (old_activities.length !== 0 && new_activities.length === 0) {
      // leave event
      events.push({
        'type': 'stop',
        'timestamp': date + ' ' + time,
      });
    }
    else if (old_activities.length === 0 && new_activities.length !== 0) {
      // Join event
      events.push({
        'type': 'start',
        'timestamp': date + ' ' + time,
      });
    }

    // update file
    fs.writeFile(game_data_path, JSON.stringify(data), (err) => {
      if (err) console.log(err);
    });

  }
  // file doesnt exist yet
  else {
    fs.writeFile(game_data_path, '{}', (err) => {
      if (err) console.log(err);
      else console.log(`Successfully created "${ game_data_path }"`);
    });
  }
});

bot.on('shardError', error => {
  console.error('A websocket connection encountered an error:', error);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
});

bot.login(process.env.DISCORD_LOGIN_TOKEN);
