// TinyFish API service layer
const API_KEY = 'sk-tinyfish-W_FP631-vIwcW9XTzLZ-qBG6F4IgWO5-';

const ENDPOINTS = {
  search:   'https://api.search.tinyfish.ai',
  fetch:    'https://api.fetch.tinyfish.ai',
  agent:    'https://agent.tinyfish.ai/v1/automation',
  research: 'https://agent.tinyfish.ai/v1/automation/run-research',
};

const headers = {
  'Content-Type': 'application/json',
  'X-API-Key': API_KEY,
};

// ─── Search ────────────────────────────────────────────────────────────────
export async function searchWeb({ query, domain_type = 'web', num_results = 10, location, language, after_date, before_date, recency_minutes, purpose }) {
  const params = new URLSearchParams({ query });
  if (domain_type)      params.set('domain_type', domain_type);
  if (num_results)      params.set('num_results', num_results);
  if (location)         params.set('location', location);
  if (language)         params.set('language', language);
  if (after_date)       params.set('after_date', after_date);
  if (before_date)      params.set('before_date', before_date);
  if (recency_minutes)  params.set('recency_minutes', recency_minutes);
  if (purpose)          params.set('purpose', purpose);

  const res = await fetch(`${ENDPOINTS.search}?${params.toString()}`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Search failed: ${res.status}`);
  }
  return res.json();
}

// ─── Fetch ─────────────────────────────────────────────────────────────────
export async function fetchUrls({ urls, format = 'markdown', include_links = false, purpose, ttl }) {
  const body = { urls, format, links: include_links };
  if (purpose) body.purpose = purpose;
  if (ttl !== undefined) body.ttl = ttl;

  const res = await fetch(ENDPOINTS.fetch, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Fetch failed: ${res.status}`);
  }
  return res.json();
}

// ─── Agent (sync /run) ─────────────────────────────────────────────────────
export async function runAgent({ url, goal, output_schema, browser_profile = 'lite', proxy_config }) {
  const body = { url, goal, browser_profile };
  if (output_schema) body.output_schema = output_schema;
  if (proxy_config)  body.proxy_config = proxy_config;

  const res = await fetch(`${ENDPOINTS.agent}/run`, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Agent run failed: ${res.status}`);
  }
  return res.json();
}

// ─── Agent (async) ─────────────────────────────────────────────────────────
export async function runAgentAsync({ url, goal, output_schema, browser_profile = 'lite' }) {
  const body = { url, goal, browser_profile };
  if (output_schema) body.output_schema = output_schema;

  const res = await fetch(`${ENDPOINTS.agent}/run-async`, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Agent async failed: ${res.status}`);
  }
  return res.json();
}

// ─── Poll run status ───────────────────────────────────────────────────────
export async function getRunStatus(run_id) {
  const res = await fetch(`https://agent.tinyfish.ai/v1/runs/${run_id}`, { headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Get run failed: ${res.status}`);
  }
  return res.json();
}

// ─── Cancel run ───────────────────────────────────────────────────────────
export async function cancelRun(run_id) {
  const res = await fetch(`https://agent.tinyfish.ai/v1/runs/${run_id}/cancel`, { method: 'POST', headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Cancel failed: ${res.status}`);
  }
  return res.json();
}

// ─── Research ─────────────────────────────────────────────────────────────
export async function runResearch({ goal, output_schema }) {
  const body = { goal };
  if (output_schema) body.output_schema = output_schema;

  const res = await fetch(ENDPOINTS.research, { method: 'POST', headers, body: JSON.stringify(body) });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `Research failed: ${res.status}`);
  }
  return res.json();
}
