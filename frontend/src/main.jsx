import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from './ThemeContext'
import App from './App'
import './index.css'
import { startKeepAlive } from './utils/keepAlive'

// Start keep-alive service to prevent backend cold starts
startKeepAlive()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
        <Analytics />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
