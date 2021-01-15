import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import './index.css';
import App from './components/App';

ReactDOM.render(
  <div className="siteWrapper">
    <Router>
      <Route exact path="/" component={App}/>
    </Router>
  </div>,
  document.getElementById('root')
);
