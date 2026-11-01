import { Monitor } from 'lucide-react';

export default function MonitorPage() {
  return (
    <div style={{ padding: '24px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Monitor</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
          TinyFish Monitor API — coming soon.
        </p>
      </div>

      <div
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '64px 24px',
          gap: '14px',
          color: 'var(--text-muted)',
        }}
      >
        <Monitor size={40} strokeWidth={1.5} />
        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)' }}>Monitor API coming soon</div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '300px' }}>
          The TinyFish Monitor API will let you track changes on websites and trigger automations. Stay tuned.
        </div>
      </div>
    </div>
  );
}
