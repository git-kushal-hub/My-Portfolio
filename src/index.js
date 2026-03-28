import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// This is the entry point that tells React to render your portfolio 
// into the 'root' div we created in index.html
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
