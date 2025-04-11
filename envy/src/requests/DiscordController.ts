import axios, { AxiosRequestConfig } from 'axios';

const DISCORD_API = 'https://discordapp.com/api';

/**
 * User Endpoints
 */

const USER_API = DISCORD_API + '/users/@me';

export interface UserResponse {
  id: string;
  username: string;
  avatar: string | null;
  avatar_decoration?: any;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner?: string | null;
  banner_color: string;
  accent_color?: number | null;
  locale?: string | null;
  mfa_enabled?: boolean;
  premium_type: number;
}
export async function genDiscordUserInfo(accessToken: string) {
  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    responseType: 'json',
  };
  const discordResponse = await axios.get(USER_API, config);
  return discordResponse.data as UserResponse;
}

export function getAvatarURI(userID: string, avatar: string) {
  return `https://cdn.discordapp.com/avatars/${userID}/${avatar}`;
}
