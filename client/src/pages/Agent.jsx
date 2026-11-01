import { useState, useEffect, useRef } from 'react';
import { Bot, Play, Square, AlertCircle, Loader, CheckCircle, XCircle, Clock, Globe, Zap } from 'lucide-react';
import { runAgentAsync, getRunStatus, cancelRun } from '../services/tinyfish';

const STATUS_COLOR = {
  PENDING:   '#f59e0b',
  RUNNING:   '#3b82f6',
  COMPLETED: '#10b981',
  FAILED:    '#ef4444',
  CANCELLED: '#6b7280',
};

const STATUS_ICON = {
  PENDING:   Clock,
  RUNNING:   Loader,
  COMPLETED: CheckCircle,
  FAILED:    XCircle,
  CANCELLED: Square,
};

function StatusBadge({ status }) {
  const color = STATUS_COLOR[status] || '#6b7280';
  const Icon  = STATUS_ICON[status] || Clock;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600, background: `${color}22`, color }}>
      <Icon size={11} style={status === 'RUNNING' ? { animation: 'spin 1s linear infinite' } : {}} />
      {status}
    </span>
  );
}

export default function Agent() {
  const [url, setUrl]           = useState('');
  const [goal, setGoal]         = useState('');
  const [profile, setProfile]   = useState('lite');
  const [runs, setRuns]         = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [selected, setSelected] = useState(null);
  const pollRef                 = useRef({});

  async function handleRun(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { run_id } = await runAgentAsync({ url, goal, browser_profile: profile });
      const newRun = { run_id, status: 'PENDING', goal, url, created_at: new Date().toISOString() };
      setRuns(prev => [newRun, ...prev]);
      setSelected(run_id);
      pollRun(run_id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function pollRun(run_id) {
    const interval = setInterval(async () => {
      try {
        const data = await getRunStatus(run_id);
        setRuns(prev => prev.map(r => r.run_id === run_id ? { ...r, ...data } : r));
        if (['COMPLETED', 'FAILED', 'CANCELLED'].includes(data.status)) {
          clearInterval(interval);
          delete pollRef.current[run_id];
        }
      } catch {}
    }, 3000);
    pollRef.current[run_id] = interval;
  }

  async function handleCancel(run_id) {
    try {
      await cancelRun(run_id);
      clearInterval(pollRef.current[run_id]);
      setRuns(prev => prev.map(r => r.run_id === run_id ? { ...r, status: 'CANCELLED' } : r));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => () => Object.values(pollRef.current).forEach(clearInterval), []);

  const selectedRun = runs.find(r => r.run_id === selected);

  return (
    <div style={{ padding: '24px', maxWidth: '1100px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Agent</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Give TinyFish a URL and a goal — it browses and executes the task for you.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '20px' }}>
        {/* Left panel */}
        <div>
          <form onSubmit={handleRun} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>TARGET URL *</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 12px' }}>
                <Globe size={14} color="var(--text-muted)" />
                <input value={url} onChange={e => setUrl(e.target.value)} required placeholder="https://example.com"
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '13px' }} />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>GOAL *</label>
              <textarea value={goal} onChange={e => setGoal(e.target.value)} required rows={4}
                placeholder="Describe exactly what TinyFish should do on the page…"
                style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 12px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', resize: 'vertical', lineHeight: '1.5', boxSizing: 'border-box' }} />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>BROWSER PROFILE</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['lite', 'stealth'].map(p => (
                  <button key={p} type="button" onClick={() => setProfile(p)} style={{
                    padding: '6px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', border: '1px solid',
                    background: profile === p ? 'var(--accent)' : 'var(--bg-secondary)',
                    borderColor: profile === p ? 'var(--accent)' : 'var(--border)',
                    color: profile === p ? '#fff' : 'var(--text-secondary)',
                  }}>
                    {p}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Stealth is slower but bypasses bot detection.
              </div>
            </div>

            <button type="submit" disabled={loading || !url.trim() || !goal.trim()} style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              padding: '10px', background: 'var(--accent)', border: 'none', borderRadius: '8px',
              color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
              opacity: !url.trim() || !goal.trim() ? 0.5 : 1,
            }}>
              {loading ? <Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={15} />}
              Run Agent
            </button>
          </form>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ef444420', border: '1px solid #ef444440', borderRadius: '10px', padding: '10px 14px', color: '#ef4444', fontSize: '12px' }}>
              <AlertCircle size={14} />{error}
            </div>
          )}

          {/* Run history */}
          {runs.length > 0 && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>RUN HISTORY</div>
              {runs.map(r => (
                <div key={r.run_id} onClick={() => setSelected(r.run_id)} style={{
                  padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid var(--border)',
                  background: selected === r.run_id ? 'var(--bg-hover)' : 'transparent',
                  transition: 'background 0.15s',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <StatusBadge status={r.status} />
                    {r.status === 'RUNNING' && (
                      <button onClick={e => { e.stopPropagation(); handleCancel(r.run_id); }} style={{
                        background: '#ef444420', border: '1px solid #ef444440', borderRadius: '6px',
                        padding: '2px 8px', fontSize: '11px', color: '#ef4444', cursor: 'pointer',
                      }}>
                        Cancel
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.goal}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{r.url}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right panel — result detail */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          {selectedRun ? (
            <div>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Run ID: {selectedRun.run_id}</div>
                  <StatusBadge status={selectedRun.status} />
                </div>
                {selectedRun.num_of_steps != null && (
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{selectedRun.num_of_steps} steps</div>
                )}
              </div>

              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>GOAL</div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{selectedRun.goal}</div>
              </div>

              <div style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '10px', fontWeight: 600 }}>RESULT</div>
                {selectedRun.status === 'RUNNING' || selectedRun.status === 'PENDING' ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '13px' }}>
                    <Loader size={16} style={{ animation: 'spin 1s linear infinite', color: '#3b82f6' }} />
                    Agent is working… polling every 3s
                  </div>
                ) : selectedRun.result ? (
                  <pre style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.6', maxHeight: '500px', overflowY: 'auto' }}>
                    {typeof selectedRun.result === 'string' ? selectedRun.result : JSON.stringify(selectedRun.result, null, 2)}
                  </pre>
                ) : selectedRun.error ? (
                  <div style={{ color: '#ef4444', fontSize: '13px' }}>
                    <div style={{ fontWeight: 600, marginBottom: '4px' }}>{selectedRun.error.code}</div>
                    <div>{selectedRun.error.message}</div>
                  </div>
                ) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No result yet.</div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '12px', color: 'var(--text-muted)' }}>
              <Bot size={40} strokeWidth={1.5} />
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Run an agent to see results here</div>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
