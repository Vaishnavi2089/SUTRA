import { useState } from 'react';
import { BookOpen, Play, AlertCircle, Loader, CheckCircle } from 'lucide-react';
import { runResearch } from '../services/tinyfish';

const EXAMPLE_GOALS = [
  'What are the latest advancements in large language model reasoning?',
  'Compare the top 5 vector databases for production use in 2026.',
  'Summarize the current state of AI agent frameworks.',
];

export default function Research() {
  const [goal, setGoal]       = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [result, setResult]   = useState(null);

  async function handleResearch(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await runResearch({ goal });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: '24px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Research</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Multi-step web research — TinyFish searches, reads, and synthesizes the answer.
        </p>
      </div>

      <form onSubmit={handleResearch} style={{ marginBottom: '20px' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
          <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>RESEARCH GOAL *</label>
          <textarea
            value={goal}
            onChange={e => setGoal(e.target.value)}
            rows={4}
            required
            placeholder="What do you want to research? Be specific for better results."
            style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', resize: 'vertical', lineHeight: '1.6', boxSizing: 'border-box' }}
          />

          {/* Example goals */}
          <div style={{ marginTop: '12px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>Try an example:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {EXAMPLE_GOALS.map(g => (
                <button key={g} type="button" onClick={() => setGoal(g)} style={{
                  padding: '4px 10px', background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                  borderRadius: '20px', fontSize: '11px', color: 'var(--text-secondary)', cursor: 'pointer',
                }}>
                  {g.length > 50 ? g.slice(0, 50) + '…' : g}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading || !goal.trim()} style={{
            marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', background: 'var(--accent)', border: 'none', borderRadius: '10px',
            color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer',
            opacity: !goal.trim() ? 0.5 : 1,
          }}>
            {loading ? <Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Play size={15} />}
            Run Research
          </button>
        </div>
      </form>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ef444420', border: '1px solid #ef444440', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#ef4444', fontSize: '13px' }}>
          <AlertCircle size={16} />{error}
        </div>
      )}

      {loading && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
          <Loader size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--accent)', marginBottom: '12px' }} />
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '4px' }}>Researching…</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>TinyFish is searching and reading pages. This may take 30–60 seconds.</div>
        </div>
      )}

      {result && !loading && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={16} color="var(--success)" />
            <span style={{ fontSize: '14px', fontWeight: 600 }}>Research Complete</span>
          </div>
          <div style={{ padding: '20px', maxHeight: '600px', overflowY: 'auto' }}>
            {result.result ? (
              <div style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                {typeof result.result === 'string'
                  ? result.result
                  : result.result.result
                    ? result.result.result
                    : JSON.stringify(result.result, null, 2)}
              </div>
            ) : (
              <pre style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
