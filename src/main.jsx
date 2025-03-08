import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './Components/App'
import './Components/index.css';
import './Components/App.css';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
