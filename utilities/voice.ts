import {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    StreamType,
} from "@discordjs/voice";
import { VoiceChannel } from "discord.js";

abstract class SharedAudio {
    public static player = createAudioPlayer();
}

export async function playMP3(channel: VoiceChannel, filePath: string) {
    const sharedPlayer = SharedAudio.player;

    const resource = createAudioResource(filePath, {
        inputType: StreamType.Arbitrary,
        inlineVolume: true,
    });
    resource.volume?.setVolume(1);

    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: true,
    });

    connection.subscribe(sharedPlayer);
    sharedPlayer.play(resource);

    // following code can be used to disconnect the bot after the audio is finished
    // // while the sound is streaming
    // while (
    //     [
    //         AudioPlayerStatus.Playing,
    //         AudioPlayerStatus.Buffering,
    //         AudioPlayerStatus.AutoPaused,
    //     ].includes(sharedPlayer.state.status)
    // ) {
    //     // check every 500ms
    //     await delay(500);
    // }
    // // disconnect
    // connection.destroy();
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
