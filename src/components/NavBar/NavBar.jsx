import React from 'react';
import { FaHome, FaMusic } from 'react-icons/fa';
import { ImDatabase } from 'react-icons/im';
import { IoSend } from 'react-icons/io5';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => {
    // used for exporing the theme
    console.log({theme,});
    return ({
        appLogo: {
            height: '93.688px',
            pointerEvents: 'none',
            marginTop: '10px',
            marginBottom: '30px',
            borderRadius: '50%',
        },
        aLink: {
            textDecoration: 'none',
        },
        navEntry: {
            paddingTop: '10px',
            color: theme.palette.getContrastText(theme.custom.navBackgroundColor),
            textDecoration: 'none',
            '&:hover': {
                background: theme.palette.primary.main,
                color: theme.palette.getContrastText(theme.palette.primary.main),
                cursor: 'pointer',
            },
        },
    });});

function NavBar() {
    const classes = useStyles();
    return (
        <div>
            <img src="https://media.discordapp.net/attachments/428568679433633792/800890636919373854/server_logo_tp.png" className={classes.appLogo} alt="logo" />

            <a href={'/'} className={classes.aLink}>
                <div className={classes.navEntry}>
                    <FaHome size={35} />
                    <p>Home</p>
                </div>
            </a>
            <a href={'/sounds'} className={classes.aLink}>
                <div className={classes.navEntry}>
                    <FaMusic size={35} />
                    <p>Sounds</p>
                </div>
            </a>
            <a href={'/data'} className={classes.aLink}>
                <div className={classes.navEntry}>
                    <ImDatabase size={35} />
                    <p>Data</p>
                </div>
            </a>
            <a href={'/suggest'} className={classes.aLink}>
                <div className={classes.navEntry}>
                    <IoSend size={35} />
                    <p>Suggest</p>
                </div>
            </a>
        </div>
    );
}

export default NavBar;
