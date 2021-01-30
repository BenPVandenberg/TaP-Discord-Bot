import React from 'react';
import { FaHome, FaMusic } from 'react-icons/fa';
import { ImDatabase } from 'react-icons/im';
import { IoSend } from 'react-icons/io5';
import './NavBar.css';


function NavBar() {
    return (
        <div className="navWrapper">
            <img src="https://media.discordapp.net/attachments/428568679433633792/800890636919373854/server_logo_tp.png" className="App-logo" alt="logo" />

            <a href={'/'}>
                <div className="navEntry">
                    <FaHome size={35} />
                    <p>Home</p>
                </div>
            </a>
            <a href={'/sounds'}>
                <div className="navEntry">
                    <FaMusic size={35} />
                    <p>Sounds</p>
                </div>
            </a>
            <a href={'/data'}>
                <div className="navEntry">
                    <ImDatabase size={35} />
                    <p>Data</p>
                </div>
            </a>
            <a href={'/suggest'}>
                <div className="navEntry">
                    <IoSend size={35} />
                    <p>Suggest</p>
                </div>
            </a>
        </div>
    );
}

export default NavBar;
