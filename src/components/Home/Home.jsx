import React from 'react';
import Table from 'react-bootstrap/Table';
import { AiFillCheckCircle } from 'react-icons/ai';

function Home() {
    return (
        <div className='App'>
            <h1 className='App-header'>
                <p>Home</p>
            </h1>
            <p>
                Welcome to the T&P bot admin site. This is where you can preform
                certain actions such as looking at play and game data, make
                bot/website suggestions, and upload your own sound clips!
            </p>
            <p>
                This project is a WIP so expect it to change frequently. Please
                report bugs to Rollin on discord.
            </p>
            <Table className='text-white w-50' size='sm'>
                <thead>
                    <td>
                        <AiFillCheckCircle size={25} />
                    </td>
                    <td>View sound data</td>
                </thead>
                <thead>
                    <td>
                        <AiFillCheckCircle size={25} />
                    </td>
                    <td>Upload sound clips</td>
                </thead>
                <thead>
                    <td>
                        <AiFillCheckCircle size={25} />
                    </td>
                    <td>Better error handling (pop ups)</td>
                </thead>
                <thead>
                    <td>
                        <AiFillCheckCircle size={25} />
                    </td>
                    <td>View bot collected data</td>
                </thead>
                <thead>
                    <td></td>
                    <td>Submit suggestions (for now msg Rollin)</td>
                </thead>
                <thead>
                    <td></td>
                    <td>Polish the looks</td>
                </thead>
                <thead>
                    <td></td>
                    <td>Add Discord Auth (following will req this)</td>
                </thead>
                <thead>
                    <td></td>
                    <td>
                        Profile page where you can edit how the bot interacts
                        with you
                    </td>
                </thead>
                <thead>
                    <td></td>
                    <td>Permissions for features</td>
                </thead>
            </Table>
        </div>
    );
}

export default Home;
