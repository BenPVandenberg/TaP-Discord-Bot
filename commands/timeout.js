// timeout.js
// ========
module.exports = {
    name: "timeout",
    description: "Moves the user to their own channel for 1 min",
    // eslint-disable-next-line no-unused-vars
    execute(message, args) {
        const user_to_timeout = message.mentions.members.values().next().value;

        // verify the user @'d someone
        if (user_to_timeout === undefined) {
            message.reply("usage is /timeout @user");
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
        let eligible_channel;
        const channels = message.guild.channels.cache;
        // eslint-disable-next-line no-unused-vars
        for (const [key, channel] of channels.entries()) {
            if (["Muahahahahahah"].includes(channel.name)) {
                eligible_channel = channel;
                break;
            }
        }

        // verify we got a channel to move to
        if (!eligible_channel) {
            message.reply("there arn't any eligible channels atm.");
        }

        // the magic
        message.react("👍");
        member_to_timeout.voice.setChannel(eligible_channel);

        // join and play yt audio
        eligible_channel.join().then((connection) => {
            const dispatcher = connection.play("./audio/timeout.mp3");

            dispatcher.on("finish", () => {
                // return member
                member_to_timeout.voice.setChannel(original_channel);
                eligible_channel.leave();
            });
        });

        return;
    },
};
