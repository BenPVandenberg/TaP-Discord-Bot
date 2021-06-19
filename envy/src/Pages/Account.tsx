import { makeStyles } from "@material-ui/core/styles";
import { useAppSelector } from "../store/hooks";
import { Redirect } from "react-router-dom";
import Swal from "sweetalert2";
import { UserState } from "../types";

const useStyles = makeStyles((theme) => {
    return {
        wrapper: {
            // Following need to be specified to center correctly
            textAlign: "center",
            margin: "auto",
            // end of required values
            width: "75%",
        },
    };
});

export default function Account() {
    const user: UserState = useAppSelector((state) => state.user);
    const classes = useStyles();

    // check we have a user logged in
    if (!user.isLoggedIn) {
        Swal.fire({
            title: "Must Be Logged In",
            icon: "error",
        });
        return <Redirect to={"/"} />;
    }
    return (
        <div className={classes.wrapper}>
            <h1>Account</h1>
        </div>
    );
}
