const router = require('express').Router();
const {
  runAgentSync,
  runAgentAsync,
  runResearch,
  getRunStatus,
  cancelRun,
} = require('../controllers/agentController');

// POST /api/agent/run         — synchronous
router.post('/run', runAgentSync);

// POST /api/agent/run-async   — returns run_id immediately
router.post('/run-async', runAgentAsync);

// POST /api/agent/research    — multi-step research
router.post('/research', runResearch);

// GET  /api/agent/runs/:run_id
router.get('/runs/:run_id', getRunStatus);

// POST /api/agent/runs/:run_id/cancel
router.post('/runs/:run_id/cancel', cancelRun);

module.exports = router;
