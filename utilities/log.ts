export const INFO = "INFO";
export const WARNING = "WARNING";
export const ERROR = "ERROR";

const discord_webhook = process.env.LOG_WEBHOOK;

export function logToDiscord(message: string, level: string = INFO) {
    // if no webhook then don't do anything
    if (!discord_webhook) return;

    let data = { content: `<@142668923660140544> ${level}: ${message}` };
    fetch(discord_webhook, {
        method: "POST",
        body: JSON.stringify(data),
    });
}
