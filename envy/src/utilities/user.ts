import axios, { AxiosRequestConfig } from "axios";
import { UserState } from "../types";
import { clearTokens, getTokens, refreshTokens, revokeToken } from "./tokens";

/**
 * Get user info to fill UserState from discord api + our backend
 * @returns The new userstate from backend APIs
 */
async function fetchUserInfo(): Promise<UserState | null> {
    const DISCORD_API_URL = "https://discordapp.com/api/users/@me";
    const { accessToken } = getTokens();

    // verify token is defined
    if (!accessToken) {
        return null;
    }

    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        responseType: "json",
    };

    let discordResponse;
    let galaResponse;
    try {
        discordResponse = await axios.get(DISCORD_API_URL, config);
        galaResponse = await axios.get(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            process.env.REACT_APP_BACKEND_ADDRESS! +
                `/user/${discordResponse.data.id}`
        );
    } catch (err: any) {
        if (err.isAxiosError) return null;
        else throw err;
    }

    const discordData = discordResponse.data;
    const galaData = galaResponse.data;

    const output: UserState = {
        isLoggedIn: true,
        id: discordData.id,
        username: discordData.username,
        avatar: discordData.avatar,
        discriminator: discordData.discriminator,
        displayName: galaData.displayName,
        isAdmin: galaData.isAdmin,
    };

    return output;
}

/**
 * Attempt to log in the user (find a valid token and get info on user)
 * @returns the UserState of the signed in user
 */
export async function logInUser() {
    // try to log in user
    // check if we can get a valid user
    let userInfo: UserState | null = await fetchUserInfo();

    if (userInfo) {
        return userInfo;
    }

    // if we don't have an access token (or a valid one)
    // and we have a refresh token, then attempt to refresh the token
    await refreshTokens();
    userInfo = await fetchUserInfo();

    return userInfo;
}

/**
 * Log out the user
 */
export async function logOutUser() {
    revokeToken();
    clearTokens();
}
