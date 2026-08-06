import React from 'react';
import ReactDOM from 'react-dom/client';
import './storage'; // must run before App.jsx so window.storage exists
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
