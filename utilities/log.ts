import Discord from "discord.js";
import * as channels from "./channels";

export const INFO = 0;
export const WARNING = 1;
export const ERROR = 2;
const levelText = ["INFO", "WARNING", "ERROR"];

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
    channel.send(`<@142668923660140544> ${levelText[level]}: ${message}`);
}
