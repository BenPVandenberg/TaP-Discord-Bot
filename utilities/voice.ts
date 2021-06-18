import {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    StreamType,
    VoiceConnection,
} from "@discordjs/voice";
import { VoiceChannel } from "discord.js";
const config = require("../config.json");

export abstract class SharedAudio {
    public static player = createAudioPlayer();
    private static currentConnection: VoiceConnection | null = null;
    private static timeToLeave: Date | null = null;

    public static newActivity(connection: VoiceConnection) {
        this.currentConnection = connection;

        const now = new Date();
        // time to leave is voice_timeout_min min after last activity
        this.timeToLeave = new Date(
            now.getTime() + config.voice_timeout_min * 60000,
        );
    }

    public static checkTimeout() {
        const now = new Date();
        if (this.currentConnection && this.timeToLeave! < now) {
            this.currentConnection.destroy();

            this.currentConnection = null;
            this.timeToLeave = null;

            console.log("Disconnecting due to timeout");
        }
    }
}

export async function playMP3(
    channel: VoiceChannel,
    filePath: string,
    volume: number = 1,
) {
    const sharedPlayer = SharedAudio.player;

    const resource = createAudioResource(filePath, {
        inputType: StreamType.Arbitrary,
        inlineVolume: true,
    });
    resource.volume?.setVolume(volume);

    const connection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: true,
    });

    connection.subscribe(sharedPlayer);
    sharedPlayer.play(resource);

    // store this activity
    SharedAudio.newActivity(connection);

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
