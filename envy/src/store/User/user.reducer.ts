import { AnyAction } from "redux";
import { UserState } from "../../types";
import { LOG_IN, LOG_OUT } from "./user.types";

// TODO find out what variables we can store
export const INITIAL_STATE: UserState = {
    isLoggedIn: false,
    id: "",
    username: "",
    avatar: "",
    discriminator: "",
};

const reducer = (state = INITIAL_STATE, action: AnyAction) => {
    switch (action.type) {
        case LOG_IN:
            return {
                ...state,
                ...action.payload,
            };

        case LOG_OUT:
            return {
                ...state,
                isLoggedIn: false,
            };

        default:
            return state;
    }
};

export default reducer;