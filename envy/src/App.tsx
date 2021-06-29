import {
    createMuiTheme,
    makeStyles,
    responsiveFontSizes,
    ThemeProvider,
} from "@material-ui/core/styles";
import { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import "typeface-roboto/index.css";
import NavBar from "./Components/NavBar";
import Data from "./Pages/Data";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import NotFound from "./Pages/NotFound";
import Sounds from "./Pages/Sounds";
import Suggest from "./Pages/Suggest";
import { useAppDispatch } from "./store/hooks";
import { logIn } from "./store/User/user.actions";
import { logInUser } from "./utilities/user";

// dark theme
const darkTheme = responsiveFontSizes(
    createMuiTheme({
        palette: {
            primary: {
                main: "rgba(207,72,68,255)",
            },
            secondary: {
                main: "rgb(253,205,94)",
            },
            type: "dark",
            background: {
                default: "rgba(40, 44, 52, 1)",
            },
        },
        typography: {
            fontFamily: "Roboto",
        },
    }),
);

const useStyles = makeStyles((theme) => ({
    root: {},
    pageWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "18px",
        marginLeft: "132.48px" /* SAME AS .navWrapper width */,
    },
    navWrapper: {
        background: "#1b1e21",
        height: "100%",
        width: "132.48px" /* SAME AS .pageWrapper margin-left */,
        position: "fixed",
        top: "0",
        left: "0",
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
    },
    contentWrapper: {
        paddingLeft: "5%",
        paddingRight: "5%",
        paddingTop: "2%",
        paddingBottom: "25px",
        marginTop: "20px",
        marginBottom: "20px",
        width: "95%",
        borderRadius: "0.75rem",
        background: "rgba(0, 0, 0, 0.54)",
        color: darkTheme.palette.getContrastText("rgba(0, 0, 0, 0.54)"),
    },
    footer: {
        paddingTop: "15px",
        color: "grey",
        fontSize: "small",
    },
}));

export default function App() {
    const classes = useStyles(darkTheme);
    const dispatch = useAppDispatch();
    // @ts-ignore: CSSStyleDeclaration
    document.body.style = `background: ${darkTheme.palette.background.default}`;

    useEffect(() => {
        // try to login user using previously stored tokens
        logInUser().then((userInfo) => {
            if (userInfo) {
                dispatch(logIn(userInfo));
            }
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={classes.root}>
            <ThemeProvider theme={darkTheme}>
                {/* navbar and pageWrapper side by side */}
                <div className={classes.navWrapper}>
                    <NavBar />
                </div>
                <div className={classes.pageWrapper}>
                    <div className={classes.contentWrapper}>
                        {/* router view */}
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route path="/sounds" component={Sounds} />
                            <Route path="/data" component={Data} />
                            <Route path="/suggest" component={Suggest} />
                            <Route path="/login" component={Login} />
                            <Route component={NotFound} />
                        </Switch>
                        {/* copyright text */}
                        <p className={classes.footer}>
                            © {new Date().getFullYear()}. Made by Ben
                            Vandenberg.
                        </p>
                    </div>
                </div>
            </ThemeProvider>
        </div>
    );
}
