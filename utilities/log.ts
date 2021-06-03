import axios from "axios";

export const INFO = 0;
export const DEBUG = 1;
export const WARNING = 2;
export const ERROR = 3;
const levelText = ["INFO", "DEBUG", "WARNING", "ERROR"];

const discord_webhook = process.env.LOG_WEBHOOK;

export function logToDiscord(message: string, level: number = INFO) {
    // if no webhook then don't do anything
    if (!discord_webhook) return;

    const notifyRollin = level >= WARNING ? "<@142668923660140544> " : "";
    axios.post(discord_webhook, {
        content: `${notifyRollin}${levelText[level]}: ${message}`,
    });
}
