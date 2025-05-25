import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeProvider';
import { LanguageProvider } from './contexts/LanguageProvider';
import App from './App';
import './index.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <LanguageProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </LanguageProvider>
  </BrowserRouter>
);
