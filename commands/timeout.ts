import Discord from "discord.js";
import * as channels from "../utilities/channels";
import assert from "assert";
import StreamManager from "../utilities/streamManager";
// timeout.ts
// ========
module.exports = {
    name: "timeout",
    description: "Moves the user to their own channel for 1 min",
    admin: false,
    requireVoice: true,
    async execute(message: Discord.Message) {
        // @ts-ignore
        const userToTimeout = message.mentions.members.values().next().value;

        // verify the user @'d someone
        if (userToTimeout === undefined) {
            message.reply("usage is .timeout @user");
            return;
        }

        const memberToTimeout = userToTimeout.presence.member;
        const originalChannel = memberToTimeout.voice.channel;

        // ensure member_to_stfu is in a voice channel
        if (!originalChannel) {
            message.reply("user is not in a voice channel.");
            return;
        }

        // find a channel to move user to
        assert(message.guild);
        const channelList = message.guild.channels.cache;
        let eligibleChannel: Discord.VoiceChannel | null = null;
        for (const [, channel] of channelList.entries()) {
            if (["Muahahahahahah"].includes(channel.name)) {
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
        memberToTimeout.voice.setChannel(eligibleChannel);
        await StreamManager.playMP3(eligibleChannel, "./audio/timeout.mp3");
        memberToTimeout.voice.setChannel(originalChannel);
    },
};
