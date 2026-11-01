import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';

const routeLabels = {
  '/':         'Dashboard',
  '/search':   'Search',
  '/fetch':    'Fetch',
  '/research': 'Research',
  '/agent':    'Agent',
  '/monitor':  'Monitor',
  '/settings': 'Settings',
};

export default function TopBar() {
  const { pathname } = useLocation();
  const title = routeLabels[pathname] ?? 'SUTRA';

  return (
    <header
      style={{
        height: '56px',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
        {title}
      </h1>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Search */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '6px 12px',
          }}
        >
          <Search size={14} color="var(--text-muted)" />
          <input
            placeholder="Search..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '13px',
              width: '160px',
            }}
          />
        </div>

        {/* Notifications */}
        <button
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '7px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            color: 'var(--text-secondary)',
          }}
        >
          <Bell size={16} />
        </button>

        {/* Avatar */}
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '13px',
            fontWeight: 600,
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          VG
        </div>
      </div>
    </header>
  );
}
