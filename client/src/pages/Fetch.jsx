import { useState } from 'react';
import { Download, Plus, X, AlertCircle, Loader, ExternalLink, FileText, Code2 } from 'lucide-react';
import { fetchUrls } from '../services/tinyfish';

const FORMATS = ['markdown', 'html', 'json'];

export default function Fetch() {
  const [urls, setUrls]         = useState(['']);
  const [format, setFormat]     = useState('markdown');
  const [links, setLinks]       = useState(false);
  const [purpose, setPurpose]   = useState('');
  const [ttl, setTtl]           = useState('');
  const [results, setResults]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const [active, setActive]     = useState(0);

  function addUrl()         { if (urls.length < 10) setUrls([...urls, '']); }
  function removeUrl(i)     { setUrls(urls.filter((_, idx) => idx !== i)); }
  function updateUrl(i, v)  { const u = [...urls]; u[i] = v; setUrls(u); }

  async function handleFetch(e) {
    e.preventDefault();
    const validUrls = urls.filter(u => u.trim());
    if (!validUrls.length) return;
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const data = await fetchUrls({
        urls: validUrls,
        format,
        include_links: links,
        purpose: purpose || undefined,
        ttl: ttl !== '' ? parseInt(ttl) : undefined,
      });
      setResults(data);
      setActive(0);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const allResults = results ? [...(results.results || []), ...(results.errors || []).map(e => ({ ...e, _error: true }))] : [];

  return (
    <div style={{ padding: '24px', maxWidth: '1000px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Fetch</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Extract clean content from any URL — up to 10 at once.
        </p>
      </div>

      <form onSubmit={handleFetch}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '12px', color: 'var(--text-secondary)' }}>URLs ({urls.length}/10)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            {urls.map((url, i) => (
              <div key={i} style={{ display: 'flex', gap: '8px' }}>
                <input
                  value={url}
                  onChange={e => updateUrl(i, e.target.value)}
                  placeholder={`https://example.com${i > 0 ? '/page' + i : ''}`}
                  style={{ flex: 1, background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '9px 12px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }}
                />
                {urls.length > 1 && (
                  <button type="button" onClick={() => removeUrl(i)} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {urls.length < 10 && (
            <button type="button" onClick={addUrl} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: '1px dashed var(--border)', borderRadius: '8px', padding: '7px 14px', color: 'var(--text-muted)', fontSize: '12px', cursor: 'pointer' }}>
              <Plus size={13} /> Add URL
            </button>
          )}
        </div>

        {/* Options */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {/* Format */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px', flex: '1', minWidth: '200px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Output Format</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {FORMATS.map(f => (
                <button key={f} type="button" onClick={() => setFormat(f)}
                  style={{ padding: '5px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', border: '1px solid', fontWeight: format === f ? 600 : 400,
                    background: format === f ? 'var(--accent)' : 'var(--bg-secondary)',
                    borderColor: format === f ? 'var(--accent)' : 'var(--border)',
                    color: format === f ? '#fff' : 'var(--text-secondary)' }}
                >{f}</button>
              ))}
            </div>
          </div>

          {/* TTL */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px', flex: '1', minWidth: '180px' }}>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Cache TTL (seconds)</div>
            <input value={ttl} onChange={e => setTtl(e.target.value)} type="number" placeholder="0 = live fetch"
              style={{ width: '100%', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '7px 10px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none' }} />
          </div>

          {/* Include links */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" id="links-toggle" checked={links} onChange={e => setLinks(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
            <label htmlFor="links-toggle" style={{ fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>Include links</label>
          </div>
        </div>

        {/* Purpose */}
        <input value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="Optional: describe why you're fetching (improves quality)"
          style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '13px', outline: 'none', marginBottom: '16px', boxSizing: 'border-box' }} />

        <button type="submit" disabled={loading || !urls.some(u => u.trim())}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--accent)', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 600, fontSize: '14px', cursor: 'pointer', opacity: !urls.some(u => u.trim()) ? 0.5 : 1 }}>
          {loading ? <Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Download size={15} />}
          Fetch
        </button>
      </form>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ef444420', border: '1px solid #ef444440', borderRadius: '10px', padding: '12px 16px', marginTop: '16px', color: '#ef4444', fontSize: '13px' }}>
          <AlertCircle size={16} />{error}
        </div>
      )}

      {allResults.length > 0 && (
        <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
          {/* Tab list */}
          <div style={{ width: '220px', flexShrink: 0 }}>
            {allResults.map((r, i) => (
              <button key={i} onClick={() => setActive(i)} style={{
                width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
                background: active === i ? 'var(--bg-hover)' : 'transparent', border: '1px solid',
                borderColor: active === i ? 'var(--border)' : 'transparent',
                marginBottom: '4px', display: 'flex', flexDirection: 'column', gap: '2px',
              }}>
                <span style={{ fontSize: '12px', color: r._error ? 'var(--danger)' : 'var(--accent)', fontWeight: 600 }}>
                  {r._error ? '✗ Error' : '✓ Fetched'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {(r.url || '').replace(/^https?:\/\//, '')}
                </span>
              </button>
            ))}
          </div>

          {/* Content panel */}
          <div style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
            {allResults[active] && (() => {
              const r = allResults[active];
              if (r._error) return (
                <div style={{ padding: '20px' }}>
                  <div style={{ color: 'var(--danger)', fontWeight: 600, marginBottom: '8px' }}>Failed to fetch</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{r.error}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>{r.url}</div>
                </div>
              );
              return (
                <div>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{r.title || 'Untitled'}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.final_url || r.url}</div>
                    </div>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}><ExternalLink size={14} /></a>
                  </div>
                  {r.description && <div style={{ padding: '10px 20px', borderBottom: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-secondary)' }}>{r.description}</div>}
                  <div style={{ padding: '16px 20px', maxHeight: '500px', overflowY: 'auto' }}>
                    {r.text ? (
                      format === 'json' ? (
                        <pre style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                          {typeof r.text === 'string' ? r.text : JSON.stringify(r.text, null, 2)}
                        </pre>
                      ) : (
                        <pre style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit', lineHeight: '1.6' }}>
                          {r.text}
                        </pre>
                      )
                    ) : (
                      <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No content extracted</div>
                    )}
                  </div>
                  {r.links?.length > 0 && (
                    <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-muted)' }}>
                      {r.links.length} links found
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
