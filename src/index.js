import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import WordleGuesser from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WordleGuesser />
  </React.StrictMode>
);
