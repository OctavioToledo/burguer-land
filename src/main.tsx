import '@fontsource/sedgwick-ave-display/latin-400.css'
import '@fontsource-variable/big-shoulders-stencil-display'
import '@fontsource-variable/inter/wght.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/tokens.css'
import './styles/global.css'
import './styles/componentes.css'
import './styles/tema.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
