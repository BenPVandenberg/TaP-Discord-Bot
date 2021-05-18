import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import Swal from "sweetalert2";
import { logIn } from "../store/User/user.actions";
import { UserState } from "../types";
import { setTokens } from "../utils/tokens";
import { logInUser } from "../utils/user";

export default function Login() {
    const dispatch = useDispatch();

    // get tokens from url search pararms
    const accessToken = new URLSearchParams(window.location.search).get(
        "access_token",
    );
    const refreshToken = new URLSearchParams(window.location.search).get(
        "refresh_token",
    );

    if (accessToken && refreshToken) {
        setTokens(accessToken, refreshToken);

        logInUser().then((userInfo: UserState | null) => {
            if (userInfo) {
                dispatch(logIn(userInfo));
            }
        });
    } else {
        Swal.fire({
            title: "Something went wrong",
            text: "No token provided",
            icon: "error",
        });
    }

    return <Redirect to="/" />;
}
