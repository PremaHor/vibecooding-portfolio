import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LanguageProvider } from './i18n/LanguageContext';
import App from './App.tsx';
import './index.css';

const root = createRoot(document.getElementById('root')!);
root.render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
);

// Odstranit no-fouc až po prvním vykreslení - eliminuje probliknutí
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.documentElement.classList.remove('no-fouc');
  });
});
