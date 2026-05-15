import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter } from './router';
import { LanguageProvider } from './i18n/LanguageContext';
import App from './App.tsx';
import './index.css';

const rootEl = document.getElementById('root');

if (!rootEl) {
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

try {
  root.render(import.meta.env.DEV ? <StrictMode>{tree}</StrictMode> : tree);
} catch (err) {
  console.error(err);
  throw err;
}
