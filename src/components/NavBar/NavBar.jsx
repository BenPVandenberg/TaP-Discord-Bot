import './NavBar.css';
import logo from '../../assets/logo.svg'
import { FaHome, FaMusic } from "react-icons/fa"
import { ImDatabase } from 'react-icons/im'
import { BrowserRouter as Router, Link } from 'react-router-dom'


function navBar() {
    return (
        <div className="navWrapper">
            <img src={logo} className="App-logo" alt="logo" />

            <Router>
                <Link to={`/`}>
                    <div className="navEntry">
                        <FaHome size={35} />
                        <p>Home</p>
                    </div>
                </Link>
                <Link to={`/sounds`}>
                    <div className="navEntry">
                        <FaMusic size={35} />
                        <p>Sounds</p>
                    </div>
                </Link>
                <Link to={`/data`}>
                    <div className="navEntry">
                        <ImDatabase size={35} />
                        <p>Data</p>
                    </div>
                </Link>
            </Router>
        </div>
    );
}

export default navBar;
