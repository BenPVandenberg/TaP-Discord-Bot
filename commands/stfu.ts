import { SlashCommandBuilder } from "@discordjs/builders";
import assert from "assert";
import Discord, { CommandInteraction } from "discord.js";
import path from "path";
import * as channels from "../utilities/channels";
import StreamManager from "../utilities/streamManager";
import { getAudioDir } from "../utilities/audio";
// stfu.ts
// ========
module.exports = {
    name: "stfu",
    description: "Lets a user know they really need to stfu",
    admin: false,
    requireVoice: true,
    data: new SlashCommandBuilder()
        .setName("stfu")
        .setDescription("Lets someone know they really need to stfu")
        .addUserOption((user) =>
            user
                .setName("user")
                .setDescription("User to stfu")
                .setRequired(true),
        ),
    async execute(interaction: CommandInteraction) {
        const userToStfu = interaction.options.getUser("user");
        assert(userToStfu);
        assert(interaction.guild);
        const memberToStfu = interaction.guild.members.cache.get(userToStfu.id);
        assert(memberToStfu);

        const originalChannel = memberToStfu.voice.channel;
        // ensure member_to_stfu is in a voice channel
        if (!originalChannel) {
            return interaction.reply({
                content: "user is not in a voice channel.",
                ephemeral: true,
            });
        }
        assert(originalChannel instanceof Discord.VoiceChannel);

        // find a channel to move user to
        const channelList = interaction.guild.channels.cache;
        let eligibleChannel: Discord.VoiceChannel | null = null;
        // eslint-disable-next-line no-unused-vars
        for (const [_channelID, channel] of channelList.entries()) {
            if (
                channel.type === "GUILD_VOICE" &&
                !channel.members.size &&
                !["AFK"].includes(channel.name)
            ) {
                eligibleChannel = channels.toVoiceChannel(channel);
                break;
            }
        }

        // verify we got a channel to move to
        if (eligibleChannel === null) {
            return interaction.reply({
                content: "user is not in a voice channel.",
                ephemeral: true,
            });
        }

        interaction.reply({
            content: "Success",
            ephemeral: true,
        });

        // the magic
        memberToStfu.voice.setChannel(eligibleChannel);

        // join and play yt audio
        const randomIndex = Math.floor(Math.random() * 3);
        const soundToPlay = `stfu${randomIndex}.mp3`;
        const audioDir = getAudioDir();
        await StreamManager.playMP3(
            eligibleChannel,
            path.join(audioDir, soundToPlay),
        );
        memberToStfu.voice.setChannel(originalChannel);
    },
};
