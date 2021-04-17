export interface GameLog {
    userID: number;
    username: string;
    game: string;
    start: Date;
    end: Date | null;
}

export interface VoiceLog {
    userID: number;
    username: string;
    channel: string;
    start: Date;
    end: Date | null;
}
