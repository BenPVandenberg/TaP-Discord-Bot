import Discord from "discord.js";

export function toTextChannel(channel: Discord.GuildChannel | undefined) {
    // check its not null
    if (!channel) {
        throw new Error("Invalid channel");
    }

    // convert to textchannel
    if (
        !((channel): channel is Discord.TextChannel => channel.type === "text")(
            channel,
        )
    )
        throw new Error("Unable to make channel a text channel");

    return channel;
}

export function toVoiceChannel(channel: Discord.GuildChannel | undefined) {
    // check its not null
    if (!channel) {
        throw new Error("Invalid channel");
    }

    // convert to textchannel
    if (
        !((channel): channel is Discord.VoiceChannel =>
            channel.type === "voice")(channel)
    )
        throw new Error("Unable to make channel a voice channel");

    return channel;
}
