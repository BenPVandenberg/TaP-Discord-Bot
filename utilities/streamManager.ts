import {
    AudioResource,
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
    StreamType,
    VoiceConnection,
} from "@discordjs/voice";
import { VoiceChannel } from "discord.js";
import config from "../config.json";

export default abstract class StreamManager {
    public static player = createAudioPlayer();
    private static currentConnection: VoiceConnection | null = null;
    private static timeToLeave: Date | null = null;

    /**
     * Called when the voice connection is used, updates when the
     * bot should leave
     */
    private static updateTimeToLeave() {
        const now = new Date();
        // time to leave is voice_timeout_min min after last activity
        this.timeToLeave = new Date(
            now.getTime() + config.voice_timeout_min * 60000,
        );
    }

    /**
     * Disconnect the bot if it's passed its time to leave
     * @returns if the bot was disconnected
     */
    public static checkTimeout() {
        const now = new Date();
        if (
            this.currentConnection &&
            this.timeToLeave &&
            this.timeToLeave < now
        ) {
            console.log("Disconnecting due to timeout");

            // return if we killed the connection
            return this.killConnection();
        }
        return false;
    }

    /**
     * Stream a provided resource to a voice channel
     * @param resource Resource to stream
     * @param channel Discord channel to stream in
     */
    private static async streamResource(
        resource: AudioResource,
        channel: VoiceChannel,
    ) {
        // connection is not guaranteed to still be connected
        this.currentConnection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            // @ts-ignore
            adapterCreator: channel.guild.voiceAdapterCreator as unknown,
            selfDeaf: true,
        });

        // hook connection to player and play
        this.currentConnection.subscribe(this.player);
        this.player.play(resource);

        // update the time to leave
        this.updateTimeToLeave();
    }

    /**
     * Play a mp3 file
     * @param channel Discord channel to stream in
     * @param filePath Path to the mp3 file
     * @param volume Volume to stream at (default 1)
     */
    public static async playMP3(
        channel: VoiceChannel,
        filePath: string,
        volume: number = 1,
    ) {
        const resource = createAudioResource(filePath, {
            inputType: StreamType.Arbitrary,
            inlineVolume: true,
        });
        resource.volume?.setVolume(volume);

        await this.streamResource(resource, channel);
    }

    /**
     * Kills the current voice connection
     * @returns if the function killed the connection
     */
    public static killConnection() {
        if (this.currentConnection) {
            this.currentConnection.destroy();
            this.currentConnection = null;
            this.timeToLeave = null;
            return true;
        }
        return false;
    }
}
