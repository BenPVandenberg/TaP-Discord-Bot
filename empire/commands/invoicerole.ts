import { SlashCommandBuilder } from '@discordjs/builders';
import assert from 'assert';
import { CommandInteraction } from 'discord.js';
import config from '../config.json';
// invoicerole.ts
// ========
module.exports = {
  name: 'invoicerole',
  admin: true,
  requireVoice: false,
  data: new SlashCommandBuilder()
    .setName('invoicerole')
    .setDescription('Manages the in voice Role')
    .addSubcommand((subCommand) =>
      subCommand
        .setName('status')
        .setDescription('Checks if the in voice role will be assigned')
    )
    .addSubcommand((subCommand) =>
      subCommand
        .setName('set')
        .setDescription('Set if the in voice role will be assigned')
        .addBooleanOption((option) =>
          option
            .setName('enable')
            .setDescription('Enable or disable the in voice role')
            .setRequired(true)
        )
    ),
  async execute(interaction: CommandInteraction) {
    const subCommand = interaction.options.getSubcommand();
    const newValue = interaction.options.getBoolean('enable');

    switch (subCommand) {
      case 'status':
        return await interaction.reply({
          content: config.assign_in_voice ? 'Enabled' : 'Disabled',
        });
      case 'set':
        assert(
          typeof newValue == 'boolean',
          'The enable option must be a boolean'
        );
        // eslint-disable-next-line camelcase
        config.assign_in_voice = newValue;
        return interaction.reply({
          content:
            'In voice assignment set to ' + (newValue ? 'Enabled' : 'Disabled'),
        });
      default:
        break;
    }
  },
};
