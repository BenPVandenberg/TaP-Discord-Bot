import Discord from "discord.js";
import * as channels from "../utilities/channels";
import assert from "assert";
import StreamManager from "../utilities/streamManager";
// stfu.js
// ========
module.exports = {
    name: "stfu",
    description: "Lets a user know they really need to stfu",
    requireVoice: true,
    async execute(message: Discord.Message, args: string[]) {
        // @ts-ignore
        const user_to_stfu = message.mentions.members.values().next().value;

        // verify the user @'d someone
        if (user_to_stfu === undefined) {
            message.reply("usage is .stfu @user");
            return;
        }

        const member_to_stfu = user_to_stfu.presence.member;
        const original_channel = member_to_stfu.voice.channel;

        // ensure member_to_stfu is in a voice channel
        if (!original_channel) {
            message.reply("user is not in a voice channel.");
            return;
        }

        // find a channel to move user to
        assert(message.guild);
        const channelList = message.guild.channels.cache;
        let eligible_channel: Discord.VoiceChannel | null = null;
        // eslint-disable-next-line no-unused-vars
        for (const [, channel] of channelList.entries()) {
            if (
                channel.type === "voice" &&
                !channel.members.size &&
                !["AFK"].includes(channel.name)
            ) {
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
        member_to_stfu.voice.setChannel(eligible_channel);

        // join and play yt audio
        const random_index = Math.floor(Math.random() * 3);
        await StreamManager.playMP3(
            eligible_channel,
            `./audio/stfu${random_index}.mp3`,
        );
        member_to_stfu.voice.setChannel(original_channel);
    },
};
