import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from './router';
import { LanguageProvider } from './i18n/LanguageContext';
import App from './App.tsx';
import './index.css';

const rootEl = document.getElementById('root');
const revealUi = () => {
  document.documentElement.classList.remove('no-fouc');
};

if (!rootEl) {
  revealUi();
  throw new Error('Missing #root element');
}

const root = createRoot(rootEl);
const tree = (
  <BrowserRouter>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </BrowserRouter>
);

const scheduleReveal = () => {
  requestAnimationFrame(() => {
    requestAnimationFrame(revealUi);
  });
};

try {
  root.render(import.meta.env.DEV ? <StrictMode>{tree}</StrictMode> : tree);
} catch (err) {
  console.error(err);
  revealUi();
  throw err;
}

// Po commitu prvního snímku odstranit FOUC masku (kritický CSS: .no-fouc #root { opacity: 0 } na md+)
scheduleReveal();

// Když spadne načtení bundlu / chyba mimo try výše, nezůstat navždy neviditelní
window.setTimeout(revealUi, 6000);
