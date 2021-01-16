import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import NavBar from './components/NavBar/NavBar.jsx';
import Home from './components/Home/Home.jsx';
import Sounds from './components/Sounds/Sounds.jsx';
import Data from './components/Data/Data.jsx';

ReactDOM.render(
    <div>
        {/* navbar and pageWrapper side by side */}
        <div className="navWrapper">
            <NavBar />
        </div>
        <div className="pageWrapper">
            <div className="contentWrapper">
                <Router>
                    <Route exact path="/" component={Home} />
                    <Route path="/sounds" component={Sounds} />
                    <Route path="/data" component={Data} />
                </Router>
            </div>
        </div>
    </div>,
    document.getElementById("root")
);
