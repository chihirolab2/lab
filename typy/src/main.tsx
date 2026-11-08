import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/zen-maru-gothic/400.css';
import '@fontsource/zen-maru-gothic/500.css';
import '@fontsource/zen-maru-gothic/700.css';
import '@fontsource/quicksand/500.css';
import '@fontsource/quicksand/700.css';
import '@fontsource/dancing-script/700.css';
import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';
import './styles/screens.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
