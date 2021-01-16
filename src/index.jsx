import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './components/App.jsx';
import NavBar from './components/NavBar/NavBar.jsx';

ReactDOM.render(
    <div>
        {/* navbar and pageWrapper side by side */}
        <div className="navWrapper">
            <NavBar />
        </div>
        <div className="pageWrapper">
            <div className="contentWrapper">
                <Router>
                    <Route exact path="/" component={App} />
                    <Route path="/sounds" component={App} />
                    <Route path="/data" component={App} />
                </Router>
            </div>
        </div>
    </div>,
    document.getElementById("root")
);
