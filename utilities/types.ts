import Discord from "discord.js";

export interface Command {
    name: string;
    description: string;
    requireVoice: boolean;
    alias?: string[];
    execute: (message: Discord.Message, args: string[]) => Promise<void>;
}
