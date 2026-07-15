import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import { applyBackendData } from './data/loadSiteData'

// Merge the institute's backend data into siteData BEFORE importing App, so that
// section modules (which read siteData at module scope) pick up the real values.
// Always resolves — falls back to the Impulsse demo content if there's no alias
// or the fetch fails.
applyBackendData().finally(async () => {
  const { default: App } = await import('./App.tsx')
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>,
  )
})
