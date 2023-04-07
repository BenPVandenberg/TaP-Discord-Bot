import { SlashCommandBuilder } from '@discordjs/builders';
import assert from 'assert';
import Discord, { CommandInteraction } from 'discord.js';
import config from '../config.json';
import * as channels from '../utilities/channels';
// secretsanta.ts
// ========
module.exports = {
  name: 'secretsanta',
  admin: false,
  requireVoice: false,
  data: new SlashCommandBuilder()
    .setName('secretsanta')
    .setDescription('adds or removes sombody from secret santa'),
  async execute(interaction: CommandInteraction) {
    const secretSantaConfig = config.commands.secret_santa;

    if (!secretSantaConfig.active) {
      interaction.reply({
        content: 'Sorry you cannot join at this time.',
        ephemeral: true,
      });
      return;
    }

    assert(interaction.guild);
    const roleToAdd = interaction.guild.roles.cache.get(secretSantaConfig.role); // secret santa role

    const textChannel = channels.toTextChannel(
      interaction.guild.channels.cache.get(secretSantaConfig.channel)
    ); // secret santa text channel

    assert(roleToAdd);
    assert(interaction.member instanceof Discord.GuildMember);

    // if member already has the role
    if (interaction.member.roles.cache.has(roleToAdd.id)) {
      await interaction.member.roles.remove(roleToAdd);
      textChannel.send(`${interaction.member.toString()} has left.`);
      return interaction.reply({
        content: 'You have left the secret santa.',
        ephemeral: true,
      });
    }

    // if member doesn't have the role
    else {
      await interaction.member.roles.add(roleToAdd);
      textChannel.send(
        `${interaction.member.toString()} has joined the Secret Santa!`
      );
      return interaction.reply({
        content:
          'You have joined the secret santa. (Use the same command to leave)',
        ephemeral: true,
      });
    }
  },
};
