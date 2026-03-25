import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from './router';
import { LanguageProvider } from './i18n/LanguageContext';
import App from './App.tsx';
import './index.css';

const root = createRoot(document.getElementById('root')!);
const tree = (
  <BrowserRouter>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </BrowserRouter>
);
root.render(import.meta.env.DEV ? <StrictMode>{tree}</StrictMode> : tree);

// Odstranit no-fouc po prvním frame (1 rAF místo 2 = rychlejší LCP)
requestAnimationFrame(() => {
  document.documentElement.classList.remove('no-fouc');
});
