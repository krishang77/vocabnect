
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { Toaster } from 'sonner';

createRoot(document.getElementById("root")!).render(
  <>
    <Toaster position="top-right" richColors />
    <App />
  </>
);
