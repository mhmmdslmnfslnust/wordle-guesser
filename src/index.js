import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Import School of Life theme CSS from within src directory
import './styles/schooloflife-theme.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Add dark mode toggle functionality
// Note: This is just to ensure the toggle exists even in React components
document.addEventListener('DOMContentLoaded', () => {
  // This will create a dark mode toggle if needed
  // The actual toggle functionality is in public/js/dark-mode-toggle.js
  if (typeof window.initDarkModeToggle === 'function') {
    window.initDarkModeToggle();
  }
});
