import axios from "axios";

export const INFO = 0;
export const DEBUG = 1;
export const WARNING = 2;
export const ERROR = 3;
const levelText = ["INFO", "DEBUG", "WARNING", "ERROR"];
const levelIcon = [
    "https://icons-for-free.com/iconfiles/png/512/info-131964752893297302.png",
    "https://static.thenounproject.com/png/876267-200.png",
    "https://img.icons8.com/emoji/452/warning-emoji.png",
    "https://image.shutterstock.com/image-vector/red-alert-icon-caution-symbol-260nw-1671343564.jpg",
];

const discordWebhook = process.env.LOG_WEBHOOK;

/**
 * Attempts to send a log message to a discord text channel
 * @param message Data to send
 * @param level The message type
 */
export function logToDiscord(message: any, level: 0 | 1 | 2 | 3 = 0) {
    // if no webhook then don't do anything
    if (!discordWebhook) return;

    const notifyRollin = level >= ERROR ? "<@142668923660140544> " : "";
    axios.post(discordWebhook, {
        content: `${notifyRollin}${levelText[level]}: ${message}`,
        avatar_url: levelIcon[level], // eslint-disable-line camelcase
    });
}
