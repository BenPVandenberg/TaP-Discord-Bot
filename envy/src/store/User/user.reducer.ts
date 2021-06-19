import { AnyAction } from "redux";
import { UserState } from "../../types";
import { LOG_IN, LOG_OUT } from "./user.types";

export const INITIAL_STATE: UserState = {
    isLoggedIn: false,
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
                isLoggedIn: false,
            };

        default:
            return state;
    }
};

export default reducer;
