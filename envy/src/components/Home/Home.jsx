import React from 'react';
import Table from 'react-bootstrap/Table';
import { AiFillCheckCircle } from 'react-icons/ai';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    wrapper: {
        // Following need to be specified to center correctly
        textAlign: 'center',
        margin: 'auto',
        // end of required values
        width: '75%',
    },
});

export default function Home() {
    const classes = useStyles();
    return (
        <div className={classes.wrapper}>
            <h1>Home</h1>
            <p>
                Welcome to the T&P bot admin site. This is where you can preform
                certain actions such as looking at play and game data, make
                bot/website suggestions, and upload your own sound clips!
            </p>
            <p>
                This project is a WIP so expect it to change frequently. Please
                report bugs to Rollin on discord.
            </p>
            <Table className='text-white w-50' size='sm' style={{ margin: 'auto', }}>
                <tbody>
                    <tr>
                        <td>
                            <AiFillCheckCircle size={25} />
                        </td>
                        <td>View sound data</td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td>
                            <AiFillCheckCircle size={25} />
                        </td>
                        <td>Upload sound clips</td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td>
                            <AiFillCheckCircle size={25} />
                        </td>
                        <td>Better error handling (pop ups)</td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td>
                            <AiFillCheckCircle size={25} />
                        </td>
                        <td>View bot collected data</td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td><AiFillCheckCircle size={25} /></td>
                        <td>Submit suggestions</td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td></td>
                        <td>Polish the looks</td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td></td>
                        <td>Add Discord Auth (following will req this)</td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td></td>
                        <td>
                        Profile page where you can edit how the bot interacts
                        with you
                        </td>
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td></td>
                        <td>Permissions for features</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
}
