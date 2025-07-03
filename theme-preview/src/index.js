import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from './theme';
import ThemePreview from './ThemePreview';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <ThemePreview />
    </ThemeProvider>
  </React.StrictMode>
);
