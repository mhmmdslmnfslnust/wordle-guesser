import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Import School of Life theme CSS
import './styles/schooloflife-theme.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
