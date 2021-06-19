import axios, { AxiosRequestConfig } from "axios";
import { UserState } from "../types";
import { clearTokens, getTokens, refreshTokens, revokeToken } from "./tokens";

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
            process.env.REACT_APP_BACKEND_ADDRESS! +
                `/user?id=${discordResponse.data.id}`,
        );
    } catch (err) {
        if (err.isAxiosError) return null;
        else throw err;
    }

    const discordData = discordResponse.data;
    const galaData = galaResponse.data;

    const payload: UserState = {
        isLoggedIn: true,
        id: discordData.id,
        username: discordData.username,
        avatar: discordData.avatar,
        discriminator: discordData.discriminator,
        displayName: galaData.displayName,
        isAdmin: galaData.isAdmin,
    };

    return payload;
}

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

export async function logOutUser() {
    revokeToken();
    clearTokens();
}
