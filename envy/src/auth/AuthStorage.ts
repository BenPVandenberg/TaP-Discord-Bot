import Cookies from 'js-cookie';

/**
 * Get tokens from local cookies
 * @returns currently stored security tokens
 */
export function get() {
  return {
    accessToken: Cookies.get('access_token') ?? null,
    refreshToken: Cookies.get('refresh_token') ?? null,
  };
}

/**
 * Set token values into local cookies
 * @param accessToken
 * @param refreshToken
 */
export function set(accessToken: string, refreshToken: string) {
  if (accessToken) {
    Cookies.set('access_token', accessToken, {
      expires: 7,
      sameSite: 'strict',
      secure: true,
    });
  }
  if (refreshToken) {
    Cookies.set('refresh_token', refreshToken, {
      expires: 365,
      sameSite: 'strict',
      secure: true,
    });
  }
}

/**
 * Clear cookies used for tokens
 */
export function clear() {
  Cookies.remove('access_token');
  Cookies.remove('refresh_token');
}
