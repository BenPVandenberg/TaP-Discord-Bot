import Discord from "discord.js";
import fs from "fs";
import { Command } from "../utilities/types";
// info.ts
// ========
module.exports = {
    name: "sudo",
    description: "Runs a command as another user (admin only)",
    requireVoice: false,
    admin: true,
    async execute(message: Discord.Message, args: string[]) {
        // verify we have a user
        if (!message.mentions.members) {
            message.reply("usage: .sudo @user <command>");
            return;
        }

        const user = message.mentions.users.first();
        if (!user) {
            message.reply("usage: .sudo @user <command>");
            return;
        }
        args.shift();

        const commandString: string | undefined = args.shift();

        // verify we have required info
        if (!commandString) {
            message.reply("usage: .sudo @user <command>");
            return;
        }

        let bot_commands = [];
        // find all commands
        const commandFiles = fs
            .readdirSync("./commands")
            .filter((file) => file.endsWith(".ts"));

        // add commands to bot_commands
        for (const file of commandFiles) {
            const command: Command = require(`./${file}`);
            bot_commands.push(command);
        }

        const commandObj = bot_commands.find(
            (cmd) =>
                cmd.name === commandString ||
                (cmd.alias && cmd.alias.includes(commandString)),
        );
        if (!commandObj || commandObj.name === "sudo") {
            message.reply("not a valid command");
            return;
        }

        // exec command
        message.author = user;
        await commandObj.execute(message, args);
    },
};
