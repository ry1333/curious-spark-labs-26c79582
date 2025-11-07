import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './AppShell'
import Stream from './pages/Stream'
import Create from './pages/Create'
import Learn from './pages/Learn'
import Profile from './pages/Profile'
import AuthPage from './pages/Auth'
import RequireAuth from './components/RequireAuth'
import './index.css'

if (!import.meta.env.DEV && !location.hash) {
  // On static hosts (Lovable), default to the Stream page
  location.replace('#/stream');
}

function Router({ children }: { children: React.ReactNode }) {
  return import.meta.env.DEV ? <BrowserRouter>{children}</BrowserRouter> : <HashRouter>{children}</HashRouter>
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Stream />} />
          <Route path="/stream" element={<Stream />} />
          <Route path="/create" element={<RequireAuth><Create /></RequireAuth>} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="*" element={<Navigate to="/stream" replace />} />
          <Route path="/auth" element={<AuthPage />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
)
