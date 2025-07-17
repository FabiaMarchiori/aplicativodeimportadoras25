import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 👇 Importa a função que registra o service worker
import { registerServiceWorker } from './serviceWorkerRegistration';

createRoot(document.getElementById("root")!).render(<App />);

// 👇 Chama a função para ativar o service worker
registerServiceWorker();
