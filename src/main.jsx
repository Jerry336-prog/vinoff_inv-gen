import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import AppRoutes from './routes/AppRoutes'
import { InvoiceProvider } from './contexts/InvoiceContext'
import { AuthProvider } from "./contexts/AuthContext"


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <InvoiceProvider>
    <AppRoutes/>
    </InvoiceProvider>
    </AuthProvider>
  </StrictMode>,
)
