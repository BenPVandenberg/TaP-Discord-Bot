import {
    createMuiTheme,
    makeStyles,
    responsiveFontSizes,
    ThemeProvider,
} from "@material-ui/core/styles";
import "fontsource-roboto";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import NavBar from "./Components/NavBar";
import Data from "./Pages/Data";
import Home from "./Pages/Home";
import Sounds from "./Pages/Sounds";
import Suggest from "./Pages/Suggest";

// light theme, dark theme to come
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
            fontFamily: "fontsource-roboto",
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
        paddingTop: "20px",
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
        width: "95%",
        borderRadius: "0.75rem 0.75rem 0.75rem 0.75rem",
        background: "rgba(0, 0, 0, 0.54)",
        color: darkTheme.palette.getContrastText("rgba(0, 0, 0, 0.54)"),
    },
}));

export default function App() {
    const classes = useStyles(darkTheme);
    // @ts-ignore: CSSStyleDeclaration
    document.body.style = `background: ${darkTheme.palette.background.default}`;

    return (
        <div className={classes.root}>
            <ThemeProvider theme={darkTheme}>
                {/* navbar and pageWrapper side by side */}
                <div className={classes.navWrapper}>
                    <NavBar />
                </div>
                <div className={classes.pageWrapper}>
                    <div className={classes.contentWrapper}>
                        <Router>
                            <Route exact path="/" component={Home} />
                            <Route path="/sounds" component={Sounds} />
                            <Route path="/data" component={Data} />
                            <Route path="/suggest" component={Suggest} />
                        </Router>
                    </div>
                </div>
            </ThemeProvider>
        </div>
    );
}
