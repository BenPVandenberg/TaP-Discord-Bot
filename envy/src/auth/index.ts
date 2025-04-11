import User from 'classes/User';
import { refreshTokens, revokeToken } from 'requests/GalaController';
import * as storage from './AuthStorage';

/**
 * Attempt to log in the user (find a valid token and get info on user)
 * @returns the UserState of the signed in user
 */
export async function logInUser(accessToken: string, refreshToken: string) {
  // try to log in user
  // check if we can get a valid user
  let userInfo = await User.genFromAuthToken(accessToken);
  if (userInfo) {
    storage.set(accessToken, refreshToken);
    return userInfo;
  }

  // if we don't have an access token (or a valid one)
  // and we have a refresh token, then attempt to refresh the token
  const newTokens = await refreshTokens(refreshToken);
  if (newTokens) {
    storage.set(newTokens.accessToken, newTokens.refreshToken);
    return await User.genEnforceFromAuthToken(newTokens.accessToken);
  }

  return null;
}

/**
 * Log out the user
 */
export async function logOutUser(refreshToken: string | null | undefined) {
  if (typeof refreshToken === 'string') {
    storage.clear();
    await revokeToken(refreshToken);
  }
}
