import React from 'react';
import ReactDOM from 'react-dom/client';

// Imported css
import './index.css';

import App from './App';

// React-router-dom
import { BrowserRouter } from 'react-router-dom';

// Imported components
import SearchProvider from './context/SearchProvider';
import NotificationProvider from './context/NotificationProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <NotificationProvider>
  <SearchProvider>
    <App />
  </SearchProvider>
  </NotificationProvider>
  </BrowserRouter>
);
