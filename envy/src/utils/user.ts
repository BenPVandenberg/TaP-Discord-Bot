import axios, { AxiosRequestConfig } from "axios";
import { INITIAL_STATE } from "../store/User/user.reducer";
import { UserState } from "../types";
import Cookies from "js-cookie";

export async function getUserInfo(accessToken: string) {
    let payload: UserState = INITIAL_STATE;
    const DISCORD_API_URL = "https://discordapp.com/api/users/@me";
    const config: AxiosRequestConfig = {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        responseType: "json",
    };

    let response;
    try {
        response = await axios.get(DISCORD_API_URL, config);
    } catch (err) {
        return INITIAL_STATE;
    }

    const { data } = response;

    payload = {
        isLoggedIn: true,
        id: data.id,
        username: data.username,
        avatar: data.avatar,
        discriminator: data.discriminator,
    };

    return payload;
}

export function getTokens() {
    return {
        accessToken: Cookies.get("access_token"),
        refreshToken: Cookies.get("refresh_token"),
    };
}

export function setTokens(
    accessToken: string | undefined,
    refreshToken: string | undefined,
) {
    if (accessToken) {
        Cookies.set("access_token", accessToken, {
            expires: 7,
        });
    }
    if (refreshToken) {
        Cookies.set("refresh_token", refreshToken, {
            expires: 365,
        });
    }
}

export function clearTokens() {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
}

export async function requestNewToken(refreshToken: string) {
    const config: AxiosRequestConfig = {
        params: { refreshToken: refreshToken },
    };
    // axios.get(process.env.REACT_APP_BACKEND_ADDRESS + "/auth/refresh", config);
    const response = await axios.get(
        process.env.REACT_APP_BACKEND_ADDRESS + "/auth/refresh",
        config,
    );
    return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
    };
}

export async function recoverUser() {
    // try to log in user

    // fetch stored keys
    const { accessToken, refreshToken } = getTokens();

    let userInfo: UserState | undefined = undefined;

    // test the access token
    if (accessToken) {
        userInfo = await getUserInfo(accessToken);

        // userInfo.isLoggedIn is a bool representing if the user can be logged in
        if (userInfo.isLoggedIn) {
            return userInfo;
        }
    }

    // if we don't have an access token (or a valid one)
    // and we have a refresh token, then get new access token
    if (refreshToken && (!userInfo || !userInfo.isLoggedIn)) {
        try {
            const newTokens = await requestNewToken(refreshToken);
            setTokens(newTokens.accessToken, newTokens.refreshToken);

            userInfo = await getUserInfo(newTokens.accessToken);
            if (userInfo.isLoggedIn) {
                return userInfo;
            }
        } catch (error) {
            /*  catch an axios error
                        if this hits then both tokens are invalid
                        therefore remove cookies 
                    */
            if (error.isAxiosError) {
                clearTokens();
            } else {
                throw error;
            }
        }
    }
    return undefined;
}
