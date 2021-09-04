export interface TimeLog {
    userID: number;
    username: string;
    start: Date;
    end: Date | null;
}

export interface GameLog extends TimeLog {
    game: string;
}

export interface VoiceLog extends TimeLog {
    channel: string;
}

export interface UserState {
    isLoggedIn: boolean;
    id?: string;
    username?: string;
    displayName?: string;
    avatar?: string;
    discriminator?: string;
    isAdmin?: boolean;
}
