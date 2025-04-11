import { genDiscordUserInfo, getAvatarURI } from 'requests/DiscordController';
import {
  genUserGameLogs,
  genGalaUserInfo,
  genUserVoiceLogs,
  GalaError,
} from 'requests/GalaController';

export default class User {
  private _id: string;
  private _username: string;
  private _displayName: string;
  private _discriminator: number;
  private _isAdmin: boolean;
  private _avatar: URL | null | undefined;

  public constructor(
    id: string,
    username: string,
    displayName: string,
    discriminator: number,
    isAdmin: boolean,
    avatar?: URL | null
  ) {
    this._id = id;
    this._username = username;
    this._displayName = displayName;
    this._discriminator = discriminator;
    this._isAdmin = isAdmin;
    this._avatar = avatar;
  }

  public static async gen(type: 'ID' | 'USERNAME', value: string) {
    const data = await genGalaUserInfo(type, value);
    if (data == null) {
      throw new UserGenError(type, value);
    }
    return new this(
      data.userID,
      data.username,
      data.displayName,
      data.discriminator,
      data.isAdmin
    );
  }

  public static async genFromAuthToken(token: string) {
    try {
      return await this.genEnforceFromAuthToken(token);
    } catch (error) {
      return null;
    }
  }

  public static async genEnforceFromAuthToken(token: string) {
    const discordData = await genDiscordUserInfo(token);
    try {
      const galaData = await genGalaUserInfo('ID', discordData.id);
      return new this(
        discordData.id,
        discordData.username,
        galaData.displayName,
        Number(discordData.discriminator),
        galaData.isAdmin,
        discordData.avatar
          ? new URL(getAvatarURI(discordData.id, discordData.avatar))
          : null
      );
    } catch (error) {
      if (
        error instanceof GalaError &&
        error.message === 'No user matches that ID'
      ) {
        throw Error('You are not a member of T&P');
      } else {
        throw error;
      }
    }
  }

  public get id() {
    return this._id;
  }
  public get username() {
    return this._username;
  }
  public get displayName() {
    return this._displayName;
  }
  public get discriminator() {
    return this._discriminator;
  }
  public get isAdmin() {
    return this._isAdmin;
  }
  public get avatar() {
    return this._avatar;
  }

  public async genGameLogs() {
    return await genUserGameLogs(this._id);
  }

  public async genVoiceLogs() {
    return await genUserVoiceLogs(this._id);
  }
}

class UserGenError extends Error {
  constructor(type: string, value: string) {
    super(`Unable to generate User (type: ${type}, value: ${value})`);
  }
}
