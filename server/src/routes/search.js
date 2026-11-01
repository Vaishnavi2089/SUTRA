const router = require('express').Router();
const { search } = require('../controllers/searchController');

// GET /api/search?query=...&domain_type=web&...
router.get('/', search);

module.exports = router;
