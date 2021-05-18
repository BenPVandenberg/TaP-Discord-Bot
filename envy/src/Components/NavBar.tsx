import { makeStyles } from "@material-ui/core/styles";
import { BiLogIn, BiLogOut } from "react-icons/bi/";
import { FaHome, FaMusic } from "react-icons/fa";
import { ImDatabase } from "react-icons/im";
import { IoSend } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logOut } from "../store/User/user.actions";
import { logOutUser } from "../utils/user";

const useStyles = makeStyles((theme) => {
    return {
        appLogo: {
            height: "93.688px",
            pointerEvents: "none",
            marginTop: "10px",
            marginBottom: "30px",
            borderRadius: "50%",
        },
        aLink: {
            textDecoration: "none",
        },
        navEntry: {
            paddingTop: "10px",
            color: theme.palette.getContrastText("#1b1e21"),
            "&:hover": {
                background: theme.palette.primary.main,
                color: theme.palette.getContrastText(
                    theme.palette.primary.main,
                ),
                cursor: "pointer",
            },
        },
    };
});

export default function NavBar() {
    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const classes = useStyles();

    const logout = () => {
        logOutUser();
        dispatch(logOut());
    };

    let accountButton;
    if (user.isLoggedIn) {
        accountButton = (
            // <Link to={"/account"} className={classes.aLink}>
            <div className={classes.navEntry} onClick={logout}>
                <BiLogOut size={35} />
                <p>Log Out</p>
            </div>
            // </Link>
        );
    } else {
        accountButton = (
            <a
                href={process.env.REACT_APP_BACKEND_ADDRESS + "/auth/login"}
                className={classes.aLink}
            >
                <div className={classes.navEntry}>
                    <BiLogIn size={35} />
                    <p>Log In</p>
                </div>
            </a>
        );
    }

    return (
        <div>
            <img
                src="/favicon-104x104.png"
                className={classes.appLogo}
                alt="logo"
            />

            <Link to={"/"} className={classes.aLink}>
                <div className={classes.navEntry}>
                    <FaHome size={35} />
                    <p>Home</p>
                </div>
            </Link>
            <Link to={"/sounds"} className={classes.aLink}>
                <div className={classes.navEntry}>
                    <FaMusic size={35} />
                    <p>Sounds</p>
                </div>
            </Link>
            <Link to={"/data"} className={classes.aLink}>
                <div className={classes.navEntry}>
                    <ImDatabase size={35} />
                    <p>Data</p>
                </div>
            </Link>
            <Link to={"/suggest"} className={classes.aLink}>
                <div className={classes.navEntry}>
                    <IoSend size={35} />
                    <p>Suggest</p>
                </div>
            </Link>
            {accountButton}
        </div>
    );
}
