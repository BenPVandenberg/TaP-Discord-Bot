import assert from 'assert';
import Discord from 'discord.js';
import fs from 'fs';
import * as log from '../utilities/log';
import * as sql from '../utilities/sql';
import { Command } from '../utilities/types';

let botVoiceReady = true;

const botCommands: Command[] = [];

// find all commands
const commandFiles = fs
  .readdirSync('./commands')
  .filter((file) => file.endsWith('.ts'));

// add commands to bot
for (const file of commandFiles) {
  const command: Command = require(`../commands/${file}`);
  botCommands.push(command);
}

export default async function onInteractionCreate(
  interaction: Discord.Interaction
) {
  if (!interaction.isCommand()) return;
  const { commandName } = interaction;
  const commandObj = botCommands.find(
    (command) => command.name === commandName
  );
  if (!commandObj) return;

  // ensure voice is ready
  if (commandObj.requireVoice && !botVoiceReady) {
    return await interaction.reply({
      content: "I'm busy rn, try in a few sec.",
      ephemeral: true,
    });
  }

  // verify user is allowed to use command
  assert(interaction.member instanceof Discord.GuildMember);
  const userIsAdmin = await sql.isAdmin(interaction.member);
  if (commandObj.admin && !userIsAdmin) {
    return await interaction.reply({
      content: "You're not my boss.",
      ephemeral: true,
    });
  }

  // log command
  console.log(logInteraction(interaction));

  try {
    await commandObj.execute(interaction);
  } catch (error) {
    console.error(error);
    log.logToDiscord(error, log.ERROR);
    return await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
}

function logInteraction(interaction: Discord.CommandInteraction) {
  /**
   * Recursively log the command options
   * @param options
   * @returns {string} representing all specified options
   */
  function optionToText(
    options: Readonly<Discord.CommandInteractionOption[] | undefined>
  ): string {
    // exit condition
    if (!options) {
      return '';
    }

    let optionText = '';

    options.forEach((option) => {
      if (option.value) {
        // here if option is a value option
        optionText += `${option.name}:${option.value} `;
      } else {
        // here if option is a sub command
        optionText += `${option.name} `;
        if (option.options) {
          optionText += optionToText(option.options);
        }
      }
    });

    return optionText;
  }

  // generate options string
  const optionString = optionToText(interaction.options.data);

  assert(interaction.member instanceof Discord.GuildMember);
  const logString = `${interaction.user.username} used /${
    interaction.commandName
  } ${optionString !== '' ? 'with ' + optionString : ''}`;

  return logString.trim();
}
