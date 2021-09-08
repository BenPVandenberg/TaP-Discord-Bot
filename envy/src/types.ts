export interface TimeLog {
    userID: number;
    username: string;
    // start and end are string representations of a Date object
    start: string;
    end: string | null;
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
