import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App, enableMocking } from '@/app'
import { deferRequestsUntil } from '@/shared/api'

deferRequestsUntil(enableMocking())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
