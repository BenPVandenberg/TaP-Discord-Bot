import Discord from "discord.js";

export default async function onMessageReactionAdd(
    reaction: Discord.MessageReaction,
    user: Discord.User | Discord.PartialUser,
) {
    const emoji = reaction.emoji;
    if (emoji.name === "pngcliparthotdoghamburgerfrenchf") {
        reaction.message.react(emoji);
    }
}
