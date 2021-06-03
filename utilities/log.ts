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

const discord_webhook = process.env.LOG_WEBHOOK;

export function logToDiscord(message: string, level: 0 | 1 | 2 | 3 = 0) {
    // if no webhook then don't do anything
    if (!discord_webhook) return;

    const notifyRollin = level >= WARNING ? "<@142668923660140544> " : "";
    axios.post(discord_webhook, {
        content: `${notifyRollin}${levelText[level]}: ${message}`,
        avatar_url: levelIcon[level],
    });
}
