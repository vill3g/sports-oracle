import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { SlipProvider } from './context/SlipContext.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SlipProvider>
      <App />
    </SlipProvider>
  </React.StrictMode>,
)
