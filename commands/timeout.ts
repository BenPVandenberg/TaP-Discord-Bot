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
        const user_to_timeout = message.mentions.members.values().next().value;

        // verify the user @'d someone
        if (user_to_timeout === undefined) {
            message.reply("usage is .timeout @user");
            return;
        }

        const member_to_timeout = user_to_timeout.presence.member;
        const original_channel = member_to_timeout.voice.channel;

        // ensure member_to_stfu is in a voice channel
        if (!original_channel) {
            message.reply("user is not in a voice channel.");
            return;
        }

        // find a channel to move user to
        assert(message.guild);
        const channelList = message.guild.channels.cache;
        let eligible_channel: Discord.VoiceChannel | null = null;
        for (const [, channel] of channelList.entries()) {
            if (["Muahahahahahah"].includes(channel.name)) {
                eligible_channel = channels.toVoiceChannel(channel);
                break;
            }
        }

        // verify we got a channel to move to
        if (eligible_channel === null) {
            message.reply("there arn't any eligible channels atm.");
            return;
        }

        // the magic
        message.react("👍");
        member_to_timeout.voice.setChannel(eligible_channel);
        await StreamManager.playMP3(eligible_channel, "./audio/timeout.mp3");
        member_to_timeout.voice.setChannel(original_channel);
    },
};
