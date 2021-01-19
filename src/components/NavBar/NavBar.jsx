import React from 'react';
import './NavBar.css';
import logo from '../../assets/logo.svg';
import { FaHome, FaMusic } from 'react-icons/fa';
import { ImDatabase } from 'react-icons/im';


function NavBar() {
    return (
        <div className="navWrapper">
            <img src={logo} className="App-logo" alt="logo" />

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
        </div>
    );
}

export default NavBar;
