import axios, { AxiosRequestConfig } from 'axios';
import {
  GameLog,
  SoundResponse,
  SoundUploadResponse,
  UserResponse,
  VoiceLog,
} from './GalaResponseTypes';

export const backendAddress = process.env.REACT_APP_BACKEND_ADDRESS;

/**
 * User Endpoints
 * backend.com/user
 */
export async function genGalaUserInfo(type: 'ID' | 'USERNAME', value: string) {
  try {
    let searchResponse;
    switch (type) {
      case 'ID':
        searchResponse = await axios.get(backendAddress + `/user/${value}`);
        break;
      case 'USERNAME':
        searchResponse = await axios.get(backendAddress + '/user/search', {
          params: { username: value },
        });
        break;
    }
    return searchResponse.data as UserResponse;
  } catch (error: any) {
    galaErrorHandler(error);
    return {} as UserResponse;
  }
}

export async function genUserGameLogs(userId: string) {
  try {
    const response = await axios.get(backendAddress + `/user/${userId}/game`);
    return response.data as GameLog[];
  } catch (error: any) {
    galaErrorHandler(error);
    return [];
  }
}

export async function genUserVoiceLogs(userId: string) {
  try {
    const response = await axios.get(backendAddress + `/user/${userId}/voice`);
    return response.data as VoiceLog[];
  } catch (error: any) {
    galaErrorHandler(error);
    return [];
  }
}

/**
 * Sound Endpoints
 * backend.com/sounds
 */
export async function genAllSounds() {
  try {
    const response = await axios.get(backendAddress + '/sounds');
    return response.data as SoundResponse[];
  } catch (error: any) {
    galaErrorHandler(error);
  }
}

export type UpdateSoundInput = {
  userID: string;
  soundName: string;
  volume?: number;
  hidden?: boolean;
};
export async function updateSound({
  userID,
  soundName,
  volume,
  hidden,
}: UpdateSoundInput) {
  try {
    const response = await axios.put(
      process.env.REACT_APP_BACKEND_ADDRESS + `/sounds/${soundName}`,
      { user: userID, volume, hidden }
    );
    return response.status === 200;
  } catch (error: any) {
    galaErrorHandler(error);
  }
}

export async function uploadSound(sound: File, ownerID: string) {
  const formData = new FormData();
  formData.append('file', sound);
  formData.append('user', ownerID);

  try {
    const response = await axios.post(
      process.env.REACT_APP_BACKEND_ADDRESS + '/sounds/upload',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    if (response.status === 201) {
      return response.data as SoundUploadResponse;
    } else {
      throw new Error(
        "Unknown Error Occurred, Please report this bug on the project's github page"
      );
    }
  } catch (error: any) {
    galaErrorHandler(error);
    return {} as SoundUploadResponse;
  }
}

/**
 * Auth Endpoints
 * backend.com/auth
 */

export async function refreshTokens(refreshToken: string) {
  const config: AxiosRequestConfig = {
    params: { refreshToken },
  };

  try {
    const response = await axios.get(
      process.env.REACT_APP_BACKEND_ADDRESS + '/auth/refresh',
      config
    );
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };
  } catch (err: any) {
    if (err.isAxiosError) {
      // the tokens are invalid
      return null;
    } else {
      throw err;
    }
  }
}

export async function revokeToken(refreshToken: string) {
  const config: AxiosRequestConfig = {
    params: { refreshToken },
  };

  try {
    await axios.get(
      process.env.REACT_APP_BACKEND_ADDRESS + '/auth/revoke',
      config
    );
  } catch (err: any) {
    if (!err.isAxiosError) {
      throw err;
    }
  }
}

// END OF GALA REQUEST FUNCTIONS

function galaErrorHandler(error: Error) {
  if (axios.isAxiosError(error)) {
    let errorMessage = 'Unable to reach T&P API';
    if (error.response && error.response.data) {
      errorMessage = 'API Error: ';
      errorMessage += error.response.data.msg ?? error.response.statusText;
    }
    throw new GalaError(errorMessage);
  }
  throw error;
}

export class GalaError extends Error {}
