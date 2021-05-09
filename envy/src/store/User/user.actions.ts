import { LOG_IN, LOG_OUT } from "./user.types";
import { UserState } from "../../types";
import { INITIAL_STATE } from "./user.reducer";

export const logIn = (payload: UserState) => {
    // if failed to login then don't change status
    if (!payload.isLoggedIn) {
        return { type: LOG_IN, payload: INITIAL_STATE };
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
