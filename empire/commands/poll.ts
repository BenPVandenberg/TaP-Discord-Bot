import assert from 'assert';
import { SlashCommandBuilder } from '@discordjs/builders';
import Discord, { CommandInteraction } from 'discord.js';

const OPTION_LETTERS = [
  '🇦',
  '🇧',
  '🇨',
  '🇩',
  '🇪',
  '🇫',
  '🇬',
  '🇭',
  '🇮',
  '🇯',
  '🇰',
  '🇱',
  '🇲',
  '🇳',
  '🇴',
  '🇵',
  '🇶',
  '🇷',
  '🇸',
  '🇹',
  '🇺',
  '🇻',
  '🇼',
  '🇽',
  '🇾',
  '🇿',
];

// poll.ts
// ========
module.exports = {
  name: 'poll',
  admin: false,
  requireVoice: false,
  data: new SlashCommandBuilder()
    .setName('poll')
    .setDescription('creates a poll')
    .addStringOption((option) =>
      option
        .setName('title')
        .setDescription('Title of the poll')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('options')
        .setDescription('A semi-collon separated list of options')
        .setRequired(false)
    ),
  async execute(interaction: CommandInteraction) {
    assert(interaction.member instanceof Discord.GuildMember);

    const title = interaction.options.getString('title');
    const options = interaction.options.getString('options');

    const pollEmbed = new Discord.MessageEmbed()
      .setTitle(`**${title}**`)
      .setColor(interaction.member.displayHexColor)
      .setFooter(`Asked By: ${interaction.member.displayName}`);

    assert(interaction.channel);

    interaction.reply({
      content: 'Creating poll...',
      ephemeral: true,
    });

    let optionsArray = undefined;
    if (options) {
      optionsArray = options.split(';').filter((o) => o.trim().length > 0);

      if (optionsArray.length > OPTION_LETTERS.length) {
        interaction.reply({
          content: `Too many options! (Max ${OPTION_LETTERS.length})`,
          ephemeral: true,
        });
        return;
      }

      const description = optionsArray
        .map((option, index) => {
          return `${OPTION_LETTERS[index]} ${option}`;
        })
        .join('\n');

      pollEmbed.setDescription(description);
    }

    const pollMessage = await interaction.channel.send({
      embeds: [pollEmbed],
    });

    if (optionsArray) {
      optionsArray.forEach((option, index) => {
        pollMessage.react(OPTION_LETTERS[index]);
      });
    } else {
      await pollMessage.react('👍');
      await pollMessage.react('👎');
    }
    interaction.editReply({ content: 'Poll created!' });
  },
};
