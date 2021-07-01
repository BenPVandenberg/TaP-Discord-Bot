import Discord from "discord.js";
import * as channels from "../utilities/channels";
import * as sql from "../utilities/sql";

export default async function onGuildMemberAdd(member: Discord.GuildMember) {
    // Send the message to a designated channel on a server
    const generalChannel = channels.toTextChannel(
        member.guild.channels.cache.find((ch) => ch.name === "general"),
    );

    const rules_string =
        "1. Be wary of the wild DeadAss + Grim, they DO bite! \n" +
        "2. This is NOT a democracy (RIP ur free will) \n" +
        '3. The President is "not racist" -President \n' +
        "4. Add game ranks by using .ranks \n" +
        "BONUS: .play gbtm ;)";

    // Send the message, mentioning the member
    generalChannel.send(
        `Welcome to the server, ${member.toString()}.\n` + rules_string,
    );

    await sql.verifyUser(member);
}
