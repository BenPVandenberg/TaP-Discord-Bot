import Discord from "discord.js";

export function logToDiscord(
    message: string,
    channel: Discord.TextChannel,
    level: number = 0,
) {
    // Plan on making multiple functions for each level
    const levels = ["INFO", "WARNING", "ERROR"];

    channel.send(`${levels[level]}: ${message}`);
}
