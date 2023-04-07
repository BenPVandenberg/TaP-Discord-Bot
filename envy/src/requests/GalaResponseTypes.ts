export type UserResponse = {
  userID: string;
  displayName: string;
  username: string;
  discriminator: number;
  isAdmin: boolean;
};

export type SoundResponse = {
  soundID: number;
  soundName: string;
  occurrences: number;
  ownerID: string;
  ownerName: string;
  volume: number;
  hidden: boolean;
};

export type SoundUploadResponse = {
  fileName: string;
  name: string;
};

export interface TimeLog {
  id: number;
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
