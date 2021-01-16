import './NavBar.css';
import logo from '../../assets/logo.svg'
import { FaHome, FaMusic } from "react-icons/fa"
import { ImDatabase } from 'react-icons/im'
import { BrowserRouter as Link } from 'react-router-dom'


function NavBar() {
    return (
        <div className="navWrapper">
            <img src={logo} className="App-logo" alt="logo" />

            <div className="navEntry">
                <Link to={`/`}>
                    <FaHome size={50} />
                    <p>Home</p>
                </Link>
            </div>
            <div className="navEntry">
                <Link to={`/sounds`}>
                    <FaMusic size={50} />
                    <p>Sounds</p>
                </Link>
            </div>
            <div className="navEntry">
                <Link to={`/data`}>
                    <ImDatabase size={50}/>
                    <p>Data</p>
                </Link>
            </div>

        </div>
    );
}

export default NavBar;
