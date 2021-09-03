import { SlashCommandBuilder } from "@discordjs/builders";
import assert from "assert";
import Discord, { CommandInteraction } from "discord.js";
import path from "path";
import { getAudioDir } from "../utilities/audio";
import * as channels from "../utilities/channels";
import StreamManager from "../utilities/streamManager";
// timeout.ts
// ========
module.exports = {
    name: "timeout",
    admin: false,
    requireVoice: true,
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Moves the user to their own channel for 1 min")
        .addUserOption((user) =>
            user
                .setName("user")
                .setDescription("User to stfu")
                .setRequired(true)
        ),
    async execute(interaction: CommandInteraction) {
        const userToTimeout = interaction.options.getUser("user");
        assert(userToTimeout);
        assert(interaction.guild);
        const memberToTimeout = interaction.guild.members.cache.get(
            userToTimeout.id
        );
        assert(memberToTimeout);

        const originalChannel = memberToTimeout.voice.channel;
        // ensure member_to_stfu is in a voice channel
        if (!originalChannel) {
            return await interaction.reply({
                content: "User is not in a voice channel.",
                ephemeral: true,
            });
        }
        assert(originalChannel instanceof Discord.VoiceChannel);

        // find a channel to move user to
        const channelList = interaction.guild.channels.cache;
        let eligibleChannel: Discord.VoiceChannel | null = null;
        for (const [, channel] of channelList.entries()) {
            if (["Muahahahahahah"].includes(channel.name)) {
                eligibleChannel = channels.toVoiceChannel(channel);
                break;
            }
        }

        // verify we got a channel to move to
        if (!eligibleChannel) {
            return await interaction.reply({
                content: "There arn't any eligible channels atm.",
                ephemeral: true,
            });
        }

        await interaction.reply({
            content: `Timed out ${memberToTimeout.nickname}`,
        });

        // the magic
        memberToTimeout.voice.setChannel(eligibleChannel);
        const audioDir = getAudioDir();
        await StreamManager.playMP3(
            eligibleChannel,
            path.join(audioDir, "timeout.mp3")
        );
        memberToTimeout.voice.setChannel(originalChannel);
    },
};
