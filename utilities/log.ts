import Discord from "discord.js";
import * as channels from "./channels";

export const INFO = 0;
export const WARNING = 1;
export const ERROR = 2;

export function getDefaultChannel(guild: Discord.Guild) {
    // returns channel "tp-bot-testing"
    const defaultChannel = guild.channels.cache.get("740332251103101048");

    return channels.toTextChannel(defaultChannel);
}

export function logToDiscord(
    message: string,
    channel: Discord.TextChannel,
    level: number = 0,
) {
    // Plan on making multiple functions for each level
    const levelText = ["INFO", "WARNING", "ERROR"];

    channel.send(`@Rollin#3406 ${levelText[level]}: ${message}`);
}
