const tf = require('../services/tinyfishClient');

function proxyError(err) {
  const e = new Error(err.response?.data?.message || err.message);
  e.status = err.response?.status || 502;
  return e;
}

async function runAgentSync(req, res, next) {
  try {
    const { url, goal, output_schema, browser_profile, proxy_config } = req.body;
    if (!url || !goal) return res.status(400).json({ error: { message: 'url and goal are required' } });
    const result = await tf.runAgent({ url, goal, output_schema, browser_profile, proxy_config });
    res.json(result);
  } catch (err) {
    next(proxyError(err));
  }
}

async function runAgentAsync(req, res, next) {
  try {
    const { url, goal, output_schema, browser_profile } = req.body;
    if (!url || !goal) return res.status(400).json({ error: { message: 'url and goal are required' } });
    const result = await tf.runAgentAsync({ url, goal, output_schema, browser_profile });
    res.json(result);
  } catch (err) {
    next(proxyError(err));
  }
}

async function runResearch(req, res, next) {
  try {
    const { goal, output_schema } = req.body;
    if (!goal) return res.status(400).json({ error: { message: 'goal is required' } });
    const result = await tf.runResearch({ goal, output_schema });
    res.json(result);
  } catch (err) {
    next(proxyError(err));
  }
}

async function getRunStatus(req, res, next) {
  try {
    const { run_id } = req.params;
    const result = await tf.getRunStatus(run_id);
    res.json(result);
  } catch (err) {
    next(proxyError(err));
  }
}

async function cancelRun(req, res, next) {
  try {
    const { run_id } = req.params;
    const result = await tf.cancelRun(run_id);
    res.json(result);
  } catch (err) {
    next(proxyError(err));
  }
}

module.exports = { runAgentSync, runAgentAsync, runResearch, getRunStatus, cancelRun };
