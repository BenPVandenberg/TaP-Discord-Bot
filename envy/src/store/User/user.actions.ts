import { LOG_IN, LOG_OUT, IGNORE } from "./user.types";
import { UserState } from "../../types";

/**
 * Get state for marking the user signed in
 * @param payload the new userstate
 * @returns object for state reducer
 */
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

/**
 * Get state for marking the user signed in
 * @returns object for state reducer
 * */
export const logOut = () => {
    return {
        type: LOG_OUT,
    };
};
