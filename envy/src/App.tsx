import {
    createMuiTheme,
    makeStyles,
    responsiveFontSizes,
    ThemeProvider,
} from "@material-ui/core/styles";
import "fontsource-roboto";
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Account from "./Pages/Account";
import Data from "./Pages/Data";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Sounds from "./Pages/Sounds";
import Suggest from "./Pages/Suggest";
import NotFound from "./Pages/NotFound";
import { useAppDispatch } from "./store/hooks";
import { logIn } from "./store/User/user.actions";
import { recoverUser } from "./utils/user";

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
        borderRadius: "0.75rem 0.75rem 0.75rem 0.75rem",
        background: "rgba(0, 0, 0, 0.54)",
        color: darkTheme.palette.getContrastText("rgba(0, 0, 0, 0.54)"),
    },
}));

export default function App() {
    const classes = useStyles(darkTheme);
    const dispatch = useAppDispatch();
    // @ts-ignore: CSSStyleDeclaration
    document.body.style = `background: ${darkTheme.palette.background.default}`;

    useEffect(() => {
        recoverUser().then((userInfo) => {
            if (userInfo) {
                dispatch(logIn(userInfo));
            }
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className={classes.root}>
            <ThemeProvider theme={darkTheme}>
                <Router>
                    {/* navbar and pageWrapper side by side */}
                    <div className={classes.navWrapper}>
                        <NavBar />
                    </div>
                    <div className={classes.pageWrapper}>
                        <div className={classes.contentWrapper}>
                            <Switch>
                                <Route exact path="/" component={Home} />
                                <Route path="/sounds" component={Sounds} />
                                <Route path="/data" component={Data} />
                                <Route path="/suggest" component={Suggest} />
                                <Route path="/login" component={Login} />
                                <Route path="/account" component={Account} />
                                <Route component={NotFound} />
                            </Switch>
                        </div>
                    </div>
                </Router>
            </ThemeProvider>
        </div>
    );
}
