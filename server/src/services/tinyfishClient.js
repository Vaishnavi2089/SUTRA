const axios = require('axios');
const { TINYFISH_API_KEY, TINYFISH_SEARCH_URL, TINYFISH_FETCH_URL, TINYFISH_AGENT_URL, TINYFISH_RUNS_URL } = require('../config/env');

const tfHeaders = {
  'Content-Type': 'application/json',
  'X-API-Key': TINYFISH_API_KEY,
};

// ─── Search ────────────────────────────────────────────────────────────────
async function search(params) {
  const { data } = await axios.get(TINYFISH_SEARCH_URL, {
    headers: tfHeaders,
    params,
  });
  return data;
}

// ─── Fetch ─────────────────────────────────────────────────────────────────
async function fetchUrls(body) {
  const { data } = await axios.post(TINYFISH_FETCH_URL, body, { headers: tfHeaders });
  return data;
}

// ─── Agent — sync ──────────────────────────────────────────────────────────
async function runAgent(body) {
  const { data } = await axios.post(`${TINYFISH_AGENT_URL}/run`, body, { headers: tfHeaders });
  return data;
}

// ─── Agent — async ─────────────────────────────────────────────────────────
async function runAgentAsync(body) {
  const { data } = await axios.post(`${TINYFISH_AGENT_URL}/run-async`, body, { headers: tfHeaders });
  return data;
}

// ─── Research ──────────────────────────────────────────────────────────────
async function runResearch(body) {
  const { data } = await axios.post(`${TINYFISH_AGENT_URL}/run-research`, body, {
    headers: tfHeaders,
    timeout: 120_000, // research can take up to 2 min
  });
  return data;
}

// ─── Get run status ────────────────────────────────────────────────────────
async function getRunStatus(run_id) {
  const { data } = await axios.get(`${TINYFISH_RUNS_URL}/${run_id}`, { headers: tfHeaders });
  return data;
}

// ─── Cancel run ────────────────────────────────────────────────────────────
async function cancelRun(run_id) {
  const { data } = await axios.post(`${TINYFISH_RUNS_URL}/${run_id}/cancel`, {}, { headers: tfHeaders });
  return data;
}

module.exports = { search, fetchUrls, runAgent, runAgentAsync, runResearch, getRunStatus, cancelRun };
