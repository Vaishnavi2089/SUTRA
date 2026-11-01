import { useNavigate } from 'react-router-dom';
import { Search, Download, Bot, BookOpen, Monitor, ArrowRight, CheckCircle } from 'lucide-react';

const API_CARDS = [
  {
    to:          '/search',
    icon:        Search,
    color:       '#3b82f6',
    label:       'Search',
    badge:       'FREE',
    badgeColor:  '#10b981',
    description: 'Structured web, news, and research results ready for LLM consumption.',
    limits:      '12,000 req/day · 30 req/min',
  },
  {
    to:          '/fetch',
    icon:        Download,
    color:       '#8b5cf6',
    label:       'Fetch',
    badge:       'FREE',
    badgeColor:  '#10b981',
    description: 'Extract clean Markdown, HTML, or JSON from any URL — up to 10 at once.',
    limits:      '1,000 URLs/day · 150 URLs/min',
  },
  {
    to:          '/research',
    icon:        BookOpen,
    color:       '#f59e0b',
    label:       'Research',
    description: 'Multi-step deep research — TinyFish searches, reads, and synthesizes.',
    limits:      'Wallet-based billing',
  },
  {
    to:          '/agent',
    icon:        Bot,
    color:       '#10b981',
    label:       'Agent',
    description: 'Natural-language browser automation on any real website.',
    limits:      'Wallet-based billing',
  },
  {
    to:          '/monitor',
    icon:        Monitor,
    color:       '#6b7280',
    label:       'Monitor',
    description: 'Track website changes and trigger automations automatically.',
    limits:      'Coming soon',
    disabled:    true,
  },
];

function ApiCard({ to, icon: Icon, color, label, badge, badgeColor, description, limits, disabled }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => !disabled && navigate(to)}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        cursor: disabled ? 'default' : 'pointer',
        transition: 'border-color 0.2s, background 0.2s',
        opacity: disabled ? 0.55 : 1,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.borderColor = color; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={20} color={color} />
        </div>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {badge && (
            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px', borderRadius: '4px', background: `${badgeColor}22`, color: badgeColor }}>
              {badge}
            </span>
          )}
          {!disabled && <ArrowRight size={14} color="var(--text-muted)" />}
        </div>
      </div>
      <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '6px' }}>{label}</div>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '10px' }}>{description}</div>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{limits}</div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div style={{ padding: '24px', maxWidth: '1100px' }}>
      {/* Hero */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700 }}>SUTRA</h2>
          <span style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '3px 10px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '20px' }}>
            Powered by TinyFish
          </span>
        </div>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: '1.6' }}>
          Web infrastructure for AI agents. Search, fetch, automate, and research the web — all from one place with TinyFish's six API surfaces.
        </p>
      </div>

      {/* API grid */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', marginBottom: '14px' }}>TINYFISH APIs</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
          {API_CARDS.map(card => <ApiCard key={card.to} {...card} />)}
        </div>
      </div>

      {/* Quick info */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '14px' }}>Getting Started</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { step: 'Search & Fetch are free', desc: 'Up to 12,000 searches/day and 1,000 fetches/day — no credit card needed.' },
            { step: 'Research synthesizes the web', desc: 'Give a goal, get a comprehensive answer. TinyFish handles search + read + summarize.' },
            { step: 'Agent automates any website', desc: 'Describe a task in plain English. The agent browses, clicks, fills forms, and extracts data.' },
          ].map(({ step, desc }) => (
            <div key={step} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <CheckCircle size={16} color="var(--accent)" style={{ flexShrink: 0, marginTop: '1px' }} />
              <div>
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{step}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}> — {desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
