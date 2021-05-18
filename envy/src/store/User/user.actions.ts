import { LOG_IN, LOG_OUT, IGNORE } from "./user.types";
import { UserState } from "../../types";

export const logIn = (payload: UserState) => {
    // if failed to login then don't change status
    if (!payload.isLoggedIn) {
        return { type: IGNORE };
    }
    return {
        type: LOG_IN,
        payload: payload,
    };
};

export const logOut = () => {
    return {
        type: LOG_OUT,
    };
};
