import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Download,
  Bot,
  BookOpen,
  Monitor,
  Settings,
  Zap,
} from 'lucide-react';

const navGroups = [
  {
    label: 'OVERVIEW',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'TINYFISH APIs',
    items: [
      { to: '/search',   label: 'Search',   icon: Search,   badge: 'FREE' },
      { to: '/fetch',    label: 'Fetch',    icon: Download, badge: 'FREE' },
      { to: '/research', label: 'Research', icon: BookOpen },
      { to: '/agent',    label: 'Agent',    icon: Bot },
      { to: '/monitor',  label: 'Monitor',  icon: Monitor },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: '220px',
        minWidth: '220px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          style={{
            width: '30px',
            height: '30px',
            background: 'var(--accent)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Zap size={16} color="#fff" />
        </div>
        <span style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
          SUTRA
        </span>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '18px', overflowY: 'auto' }}>
        {navGroups.map(({ label, items }) => (
          <div key={label}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', padding: '0 6px', marginBottom: '6px' }}>
              {label}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {items.map(({ to, label: itemLabel, icon: Icon, badge }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    background: isActive ? 'var(--bg-hover)' : 'transparent',
                    transition: 'all 0.15s',
                  })}
                >
                  <Icon size={16} />
                  <span style={{ flex: 1 }}>{itemLabel}</span>
                  {badge && (
                    <span style={{
                      fontSize: '9px', fontWeight: 700, padding: '2px 5px',
                      borderRadius: '4px', background: '#10b98122', color: '#10b981',
                    }}>{badge}</span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)' }}>
        <NavLink
          to="/settings"
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 10px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontSize: '13px',
            color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
            background: isActive ? 'var(--bg-hover)' : 'transparent',
          })}
        >
          <Settings size={16} />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}
