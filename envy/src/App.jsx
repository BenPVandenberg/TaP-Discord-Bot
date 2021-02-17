import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Data from './components/Data/Data.jsx';
import Home from './components/Home/Home.jsx';
import NavBar from './components/NavBar/NavBar.jsx';
import Sounds from './components/Sounds/Sounds.jsx';
import Suggest from './components/Suggest/Suggest.jsx';

// light theme, dark theme to come
const lightTheme = createMuiTheme({
    type: 'light',
    primary: {
        main: 'rgba(207,72,68,255)',
    },
    secondary: {
        main: 'rgb(253,205,94)',
    },
    custom: {
        rootBackgroundColor: '#282c34',
        navBackgroundColor: '#1b1e21',
        navHoverColor: 'rgba(98,100,167,.7)',
        contentBackgroundColor: 'rgba(0, 0, 0, 0.54)',
    },
});

const useStyles = makeStyles(theme => ({
    root: {},
    pageWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        marginLeft: '132.48px', /* SAME AS .navWrapper width */
        paddingTop: '20px',
    },
    navWrapper: {
        background: lightTheme.custom.navBackgroundColor,
        height: '100%',
        width: '132.48px', /* SAME AS .pageWrapper margin-left */
        position: 'fixed',
        top: '0',
        left: '0',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center',
    },
    contentWrapper: {
        textAlign: 'center',
        margin: 'auto',
        paddingLeft: '5%',
        paddingRight: '5%',
        paddingTop: '2%',
        paddingBottom: '25px',
        width: '95%',
        borderRadius: '0.75rem 0.75rem 0.75rem 0.75rem',
        background: lightTheme.custom.contentBackgroundColor,
        color: lightTheme.palette.getContrastText(lightTheme.custom.contentBackgroundColor),
    },
}));

export default function App() {
    const classes = useStyles(lightTheme);
    document.body.style = `background: ${lightTheme.custom.rootBackgroundColor}`;

    return (
        <div className={classes.root}>
            <ThemeProvider theme={lightTheme}>
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
