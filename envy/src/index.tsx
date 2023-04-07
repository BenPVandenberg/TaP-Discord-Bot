import AuthLoader from 'components/AuthLoader';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import App from './App';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <AuthLoader />
      <Router>
        <App />
      </Router>
    </RecoilRoot>
  </React.StrictMode>
);
