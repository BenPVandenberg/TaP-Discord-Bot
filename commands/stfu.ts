import assert from "assert";
import Discord from "discord.js";
import path from "path";
import * as channels from "../utilities/channels";
import StreamManager from "../utilities/streamManager";
// stfu.ts
// ========
module.exports = {
    name: "stfu",
    description: "Lets a user know they really need to stfu",
    admin: false,
    requireVoice: true,
    async execute(message: Discord.Message) {
        // @ts-ignore
        const userToStfu = message.mentions.members.values().next().value;

        // verify the user @'d someone
        if (userToStfu === undefined) {
            message.reply("usage is .stfu @user");
            return;
        }

        const memberToStfu = userToStfu.presence.member;
        const originalChannel = memberToStfu.voice.channel;

        // ensure member_to_stfu is in a voice channel
        if (!originalChannel) {
            message.reply("user is not in a voice channel.");
            return;
        }

        // find a channel to move user to
        assert(message.guild);
        const channelList = message.guild.channels.cache;
        let eligibleChannel: Discord.VoiceChannel | null = null;
        // eslint-disable-next-line no-unused-vars
        for (const [, channel] of channelList.entries()) {
            if (
                channel.type === "voice" &&
                !channel.members.size &&
                !["AFK"].includes(channel.name)
            ) {
                eligibleChannel = channels.toVoiceChannel(channel);
                break;
            }
        }

        // verify we got a channel to move to
        if (eligibleChannel === null) {
            message.reply("there arn't any eligible channels atm.");
            return;
        }

        // the magic
        message.react("👍");
        memberToStfu.voice.setChannel(eligibleChannel);

        // join and play yt audio
        const randomIndex = Math.floor(Math.random() * 3);
        const soundToPlay = `stfu${randomIndex}.mp3`;
        const audioDir = process.env.AUDIO_DIR ?? "./audio/";
        await StreamManager.playMP3(
            eligibleChannel,
            path.join(audioDir, soundToPlay),
        );
        memberToStfu.voice.setChannel(originalChannel);
    },
};
