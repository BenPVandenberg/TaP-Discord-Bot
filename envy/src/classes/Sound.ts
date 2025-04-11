import { genAllSounds, uploadSound } from 'requests/GalaController';
import User from './User';

export default class Sound {
  private _id: number;
  private _name: string;
  private _occurrences: number;
  private _ownerID: string;
  private _ownerName: string;
  private _volume: number;
  private _hidden: boolean;
  private _staging: {
    volume?: number;
    hidden?: boolean;
  };

  public static MAX_SOUND_VOLUME = 3;

  public constructor(
    id: number,
    name: string,
    occurrences: number,
    ownerID: string,
    ownerName: string,
    volume: number,
    hidden: boolean
  ) {
    this._id = id;
    this._name = name;
    this._occurrences = occurrences;
    this._ownerID = ownerID;
    this._ownerName = ownerName;
    this._volume = volume;
    this._hidden = hidden;
    this._staging = {};
  }

  public static async genFromFile(sound: File, owner: User) {
    const newSoundInfo = await uploadSound(sound, owner.id);

    // TODO: Add new api to get single sound info and use it to get this info
    return new this(
      80085,
      newSoundInfo.name,
      0,
      owner.id,
      owner.username,
      1,
      false
    );
  }

  public static async genAll() {
    const data = await genAllSounds();
    if (data == null) {
      throw new SoundGenError();
    }
    return data.map((sound) => {
      return new this(
        sound.soundID,
        sound.soundName,
        sound.occurrences,
        sound.ownerID,
        sound.ownerName,
        sound.volume,
        sound.hidden
      );
    });
  }

  public get id() {
    return this._id;
  }
  public get name() {
    return this._name;
  }
  public get occurrences() {
    return this._occurrences;
  }
  public get ownerID() {
    return this._ownerID;
  }
  public get ownerName() {
    return this._ownerName;
  }
  public get volume() {
    return this._volume;
  }
  public set volume(value: number) {
    this._staging = { ...this._staging, volume: value };
  }
  public get hidden() {
    return this._hidden;
  }
  public set hidden(value: boolean) {
    this._staging = { ...this._staging, hidden: value };
  }

  public async genUpdate(bypassChecks: boolean = false) {
    if (!bypassChecks) {
      this.validateChanges();
    }

    // const success = this.isModified()
    //   ? await updateSound({
    //       userID: this._ownerID,
    //       soundName: this._name,
    //       volume: this._staging.volume,
    //       hidden: this._staging.hidden,
    //     })
    //   : false;
    const success = false;

    if (success) {
      this._volume = this._staging.volume ?? this._volume;
      this._hidden = this._staging.hidden ?? this._hidden;
      this.clearChanges();
    }
    return success;
  }

  public isModified() {
    return (
      ![this._volume, undefined].includes(this._staging.volume) ||
      ![this._hidden, undefined].includes(this._staging.hidden)
    );
  }

  public clearChanges() {
    this._staging = {};
  }

  private validateChanges() {
    // volume
    if (this._staging.volume && this._staging.volume > Sound.MAX_SOUND_VOLUME) {
      throw new SoundValidationError(
        `Only admins can set a sounds volume above ${Sound.MAX_SOUND_VOLUME}`
      );
    }
  }
}

export class SoundError extends Error {}

export class SoundValidationError extends SoundError {}

export class SoundGenError extends SoundError {
  constructor() {
    super('Unable to generate Sounds');
  }
}
