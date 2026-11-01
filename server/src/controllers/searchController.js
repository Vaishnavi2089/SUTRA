const tf = require('../services/tinyfishClient');

async function search(req, res, next) {
  try {
    const { query, domain_type, num_results, location, language, after_date, before_date, recency_minutes, purpose, page } = req.query;
    if (!query) return res.status(400).json({ error: { message: 'query is required' } });

    const result = await tf.search({
      query,
      ...(domain_type      && { domain_type }),
      ...(num_results      && { num_results: parseInt(num_results) }),
      ...(location         && { location }),
      ...(language         && { language }),
      ...(after_date       && { after_date }),
      ...(before_date      && { before_date }),
      ...(recency_minutes  && { recency_minutes: parseInt(recency_minutes) }),
      ...(purpose          && { purpose }),
      ...(page             && { page: parseInt(page) }),
    });
    res.json(result);
  } catch (err) {
    next(proxyError(err));
  }
}

module.exports = { search };

function proxyError(err) {
  const e = new Error(err.response?.data?.message || err.message);
  e.status = err.response?.status || 502;
  return e;
}
