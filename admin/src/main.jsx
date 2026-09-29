import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/700.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
	<BrowserRouter basename="/admin">
    		<App />
	</BrowserRouter>
  </StrictMode>,
)
