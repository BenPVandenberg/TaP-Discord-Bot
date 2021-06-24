import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import Swal from "sweetalert2";
import { logIn } from "../store/User/user.actions";
import { setTokens } from "../utils/tokens";
import { logInUser } from "../utils/user";

export default function Login() {
    const dispatch = useDispatch();

    let errorTitle: string | null = null;
    let errorMessage: string | null = null;

    // STEP 1
    // check for errors from backend
    const errorParam = new URLSearchParams(window.location.search).get("error");
    const errorDescription = new URLSearchParams(window.location.search).get(
        "error_description",
    );

    if (errorParam) {
        // most common error is the access_denied error
        errorTitle =
            errorParam === "access_denied" ? "Access Denied" : errorParam;
        errorMessage = errorDescription;
    }

    // STEP 2
    // get tokens from url search pararms
    const accessToken = new URLSearchParams(window.location.search).get(
        "access_token",
    );
    const refreshToken = new URLSearchParams(window.location.search).get(
        "refresh_token",
    );

    if (accessToken && refreshToken) {
        setTokens(accessToken, refreshToken);

        logInUser().then((userInfo) => {
            if (userInfo) {
                dispatch(logIn(userInfo));
            }
        });
    } else if (!errorTitle) {
        errorTitle = "Something went wrong";
        errorMessage = "No token provided";
    }

    // STEP 3
    // display any errors
    if (errorTitle) {
        Swal.fire({
            title: errorTitle,
            text: errorMessage ?? undefined,
            icon: "error",
        });
    }

    return <Redirect to="/" />;
}
