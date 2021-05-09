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

export interface UserState {
    isLoggedIn: boolean;
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
}
