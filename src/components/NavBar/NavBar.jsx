import logo from '../../assets/logo.svg'
import './NavBar.css';

function navBar() {
    return (
        <div className="navWrapper">
            <img src={logo} className="App-logo" alt="logo" height="10px" />
        </div>
    );
}

export default navBar;
