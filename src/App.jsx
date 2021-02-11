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
    palette: {
        primary: {
            main: '#f4511e'
        },
        secondary: {
            main: '#82b1ff'
        }
    }
});

const useStyles = makeStyles({
    navWrapper: {
        background: '#1b1e21',
        height: '100%',
        width: '132.48px', /* SAME AS .pageWrapper margin-left */
        position: 'fixed',
        top: '0',
        left: '0',
        transition: '.5s ease',
        display: 'flex',
        flexDirection: 'column',
        textAlign: 'center'
    },
    pageWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        marginLeft: '132.48px', /* SAME AS .navWrapper width */
        paddingTop: '20px',
    },
    contentWrapper: {
        paddingLeft: '5%',
        paddingRight: '5%',
        paddingTop: '2%',
        paddingBottom: '2%',
        width: '95%',
        background: 'rgba(0, 0, 0, 0.54)',
        borderRadius: '0.75rem 0.75rem 0.75rem 0.75rem',
    }
});

export default function App() {
    const classes = useStyles();

    return (
        <div>
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
