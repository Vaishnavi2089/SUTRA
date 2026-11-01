const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');

const { PORT, NODE_ENV, CLIENT_URL } = require('./config/env');
const { errorHandler, notFound }     = require('./middleware/errorHandler');

const searchRoutes = require('./routes/search');
const fetchRoutes  = require('./routes/fetch');
const agentRoutes  = require('./routes/agent');

const app = express();

// ─── Security ──────────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ──────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (server-to-server, curl) and the client URL
    const allowed = [CLIENT_URL, 'http://localhost:5173', 'http://localhost:4173'];
    if (!origin || allowed.some(o => origin.startsWith(o))) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

// ─── Body parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ───────────────────────────────────────────────────────────────
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Rate limiting ─────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max:      60,
  standardHeaders: true,
  legacyHeaders:   false,
  message: { error: { message: 'Too many requests — slow down.' } },
});
app.use('/api/', limiter);

// ─── Health check ──────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ─── API Routes ────────────────────────────────────────────────────────────
app.use('/api/search', searchRoutes);
app.use('/api/fetch',  fetchRoutes);
app.use('/api/agent',  agentRoutes);

// ─── 404 + error handlers ──────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ─── Start ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[SUTRA] Server running on port ${PORT} (${NODE_ENV})`);
});

module.exports = app;
