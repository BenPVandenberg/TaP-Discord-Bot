import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import Swal from "sweetalert2";
import { logIn } from "../store/User/user.actions";
import { UserState } from "../types";
import { getUserInfo, setTokens } from "../utils/user";

export default function Login() {
    const dispatch = useDispatch();

    const fetchTokens = () => {
        const newToken = new URLSearchParams(window.location.search).get(
            "access_token",
        );
        const refreshToken = new URLSearchParams(window.location.search).get(
            "refresh_token",
        );

        if (newToken === null || refreshToken === null) {
            Swal.fire({
                title: "Something went wrong",
                text: "No token provided",
                icon: "error",
            });
            return { accessToken: undefined, refreshToken: undefined };
        }
        return { accessToken: newToken, refreshToken: refreshToken };
    };

    const { accessToken, refreshToken } = fetchTokens()!;
    setTokens(accessToken, refreshToken);

    if (accessToken) {
        getUserInfo(accessToken).then((userInfo: UserState) => {
            dispatch(logIn(userInfo));
        });
    }

    return <Redirect to="/" />;
}
