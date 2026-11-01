const tf = require('../services/tinyfishClient');

async function fetchUrls(req, res, next) {
  try {
    const { urls, format, links, purpose, ttl, include_links } = req.body;
    if (!urls || !Array.isArray(urls) || urls.length === 0)
      return res.status(400).json({ error: { message: 'urls array is required' } });
    if (urls.length > 10)
      return res.status(400).json({ error: { message: 'Maximum 10 URLs per request' } });

    const result = await tf.fetchUrls({
      urls,
      ...(format        && { format }),
      ...(links !== undefined && { links }),
      ...(include_links !== undefined && { links: include_links }),
      ...(purpose       && { purpose }),
      ...(ttl !== undefined && { ttl }),
    });
    res.json(result);
  } catch (err) {
    next(proxyError(err));
  }
}

module.exports = { fetchUrls };

function proxyError(err) {
  const e = new Error(err.response?.data?.message || err.message);
  e.status = err.response?.status || 502;
  return e;
}
