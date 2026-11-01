import { useState } from 'react';
import { Search as SearchIcon, Globe, Newspaper, BookOpen, ExternalLink, Clock, AlertCircle, Loader } from 'lucide-react';
import { searchWeb } from '../services/tinyfish';

const DOMAIN_TYPES = [
  { value: 'web',            label: 'Web',      icon: Globe },
  { value: 'news',           label: 'News',     icon: Newspaper },
  { value: 'research_paper', label: 'Research', icon: BookOpen },
];

export default function Search() {
  const [query, setQuery]           = useState('');
  const [domainType, setDomainType] = useState('web');
  const [recency, setRecency]       = useState('');
  const [results, setResults]       = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);
  const [page, setPage]             = useState(0);

  async function handleSearch(e, overridePage) {
    e?.preventDefault();
    const currentPage = overridePage ?? page;
    setLoading(true);
    setError(null);
    try {
      const data = await searchWeb({
        query,
        domain_type: domainType,
        num_results: 10,
        recency_minutes: recency ? parseInt(recency) : undefined,
        page: currentPage,
      });
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function goPage(p) {
    setPage(p);
    handleSearch(null, p);
  }

  return (
    <div style={{ padding: '24px', maxWidth: '900px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Web Search</h2>
        <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>
          Search the web and get structured results via TinyFish.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '10px 16px' }}>
            <SearchIcon size={16} color="var(--text-muted)" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search anything..."
              required
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-primary)', fontSize: '14px' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            style={{
              padding: '10px 20px', background: loading ? 'var(--bg-hover)' : 'var(--accent)',
              border: 'none', borderRadius: '10px', color: '#fff', fontWeight: 600, fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
              opacity: !query.trim() ? 0.5 : 1,
            }}
          >
            {loading ? <Loader size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <SearchIcon size={15} />}
            Search
          </button>
        </div>

        {/* Filters row */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {DOMAIN_TYPES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setDomainType(value)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                  border: '1px solid', transition: 'all 0.15s',
                  background: domainType === value ? 'var(--accent)' : 'var(--bg-card)',
                  borderColor: domainType === value ? 'var(--accent)' : 'var(--border)',
                  color: domainType === value ? '#fff' : 'var(--text-secondary)',
                }}
              >
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
            <Clock size={13} color="var(--text-muted)" />
            <select
              value={recency}
              onChange={e => setRecency(e.target.value)}
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '5px 10px', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer' }}
            >
              <option value="">Any time</option>
              <option value="60">Last hour</option>
              <option value="1440">Last 24h</option>
              <option value="10080">Last week</option>
              <option value="43200">Last month</option>
            </select>
          </div>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ef444420', border: '1px solid #ef444440', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px', color: '#ef4444', fontSize: '13px' }}>
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {/* Results */}
      {results && (
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            {results.total} result{results.total !== 1 ? 's' : ''} for "{results.query}"
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {results.results?.map((r) => (
              <div key={r.url} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '6px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--accent)', marginBottom: '4px' }}>{r.domain}</div>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none' }}>
                      {r.title}
                    </a>
                  </div>
                  <a href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                    <ExternalLink size={14} />
                  </a>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{r.snippet}</p>
                {r.published_date && (
                  <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    {r.published_date} {r.publisher ? `· ${r.publisher}` : ''}
                  </div>
                )}
                {/* Research paper extras */}
                {r.authors && (
                  <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                    {Array.isArray(r.authors) ? r.authors.join(', ') : r.authors}
                    {r.venue ? ` · ${r.venue}` : ''}
                    {r.year ? ` · ${r.year}` : ''}
                    {r.citation_count != null ? ` · ${r.citation_count} citations` : ''}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {results.results?.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
              <button
                onClick={() => goPage(page - 1)}
                disabled={page === 0 || loading}
                style={{ padding: '7px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '13px', cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.4 : 1 }}
              >
                ← Prev
              </button>
              <span style={{ padding: '7px 14px', fontSize: '13px', color: 'var(--text-muted)' }}>Page {page + 1}</span>
              <button
                onClick={() => goPage(page + 1)}
                disabled={loading || results.results?.length < 10}
                style={{ padding: '7px 14px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', opacity: results.results?.length < 10 ? 0.4 : 1 }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {!results && !loading && (
        <div style={{ textAlign: 'center', padding: '64px 24px', color: 'var(--text-muted)' }}>
          <SearchIcon size={40} strokeWidth={1.5} style={{ marginBottom: '12px' }} />
          <div style={{ fontSize: '14px' }}>Enter a query to search the web</div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
