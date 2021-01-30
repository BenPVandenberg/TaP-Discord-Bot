import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Data from './components/Data/Data.jsx';
import Home from './components/Home/Home.jsx';
import NavBar from './components/NavBar/NavBar.jsx';
import Sounds from './components/Sounds/Sounds.jsx';
import Suggest from './components/Suggest/Suggest.jsx';
import './index.css';

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
                    <Route path="/suggest" component={Suggest} />
                </Router>
            </div>
        </div>
    </div>,
    document.getElementById('root')
);
