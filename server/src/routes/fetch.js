const router = require('express').Router();
const { fetchUrls } = require('../controllers/fetchController');

// POST /api/fetch  body: { urls, format, links, purpose, ttl }
router.post('/', fetchUrls);

module.exports = router;
