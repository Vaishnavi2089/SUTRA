import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Fetch from './pages/Fetch';
import Agent from './pages/Agent';
import Research from './pages/Research';
import MonitorPage from './pages/MonitorPage';
import Settings from './pages/Settings';

export default function App() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg-primary)' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar />

        <main style={{ flex: 1, overflowY: 'auto' }}>
          <Routes>
            <Route path="/"         element={<Dashboard />} />
            <Route path="/search"   element={<Search />} />
            <Route path="/fetch"    element={<Fetch />} />
            <Route path="/research" element={<Research />} />
            <Route path="/agent"    element={<Agent />} />
            <Route path="/monitor"  element={<MonitorPage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*"         element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
