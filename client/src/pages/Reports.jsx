import { FileBarChart2 } from 'lucide-react';

export default function Reports() {
  return (
    <div style={{ padding: '24px', maxWidth: '1200px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Reports</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Insights and analytics from your agents.
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
        <FileBarChart2 size={40} strokeWidth={1.5} />
        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)' }}>No reports yet</div>
        <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', maxWidth: '280px' }}>
          Generated reports will appear here once missions are complete.
        </div>
      </div>
    </div>
  );
}
