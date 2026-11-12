import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'
// ShaMallya order: tokens, mapping, Tailwind, then this app's own styles.
import '@shamallya-ui/tokens/css'
import './styles/shamallya-mapping.css'
import './styles/tailwind.css'
import './styles.css'

registerSW({ immediate: true })
createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
