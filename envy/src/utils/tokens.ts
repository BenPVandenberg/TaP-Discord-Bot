import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

export function getTokens() {
    return {
        accessToken: Cookies.get("access_token") ?? null,
        refreshToken: Cookies.get("refresh_token") ?? null,
    };
}

export function setTokens(accessToken: string, refreshToken: string) {
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

export async function refreshTokens() {
    const { refreshToken } = getTokens();

    // verify token is defined
    if (!refreshToken) {
        return null;
    }

    const config: AxiosRequestConfig = {
        params: { refreshToken },
    };

    // try to make the request
    let response;
    try {
        response = await axios.get(
            process.env.REACT_APP_BACKEND_ADDRESS + "/auth/refresh",
            config,
        );
        setTokens(response.data.access_token, response.data.refresh_token);
    } catch (err) {
        if (err.isAxiosError) {
            // the tokens is invalid therefore get rid of them
            clearTokens();
        } else {
            throw err;
        }
    }
}

export async function revokeToken() {
    const { refreshToken } = getTokens();

    // verify token is defined
    if (!refreshToken) {
        return;
    }

    const config: AxiosRequestConfig = {
        params: { refreshToken },
    };

    // try to make the request
    try {
        await axios.get(
            process.env.REACT_APP_BACKEND_ADDRESS + "/auth/revoke",
            config,
        );
    } catch (err) {
        if (!err.isAxiosError) {
            throw err;
        }
    }
}
