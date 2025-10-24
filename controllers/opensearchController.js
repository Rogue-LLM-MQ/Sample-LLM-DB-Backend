//controllers/opensearch.js
const client = require('../config/opensearch');

// Example: index name for your LLM logs
const INDEX_NAME = 'llm-policy-logs';

/**
 * Send a single log event to OpenSearch.
 * Expects a JSON body from the frontend or extension like:
 * {
 *   "@timestamp": "2025-10-24T04:00:00Z",
 *   "event": { "action": "policy.enforced" },
 *   "rule": { "id": 1, "source": "dynamic" },
 *   "http": { "request": { "method": "GET", "referrer": "..." } },
 *   "url": "https://something.com",
 *   "chrome": { "tabId": 123 }
 * }
 */
exports.sendLog = async (req, res) => {
  try {
    const log = req.body;

    if (!log || typeof log !== 'object') {
      return res.status(400).json({ error: 'Invalid log format' });
    }

    const response = await client.index({
      index: INDEX_NAME,
      body: {
        ...log,
        received_at: new Date().toISOString()
      }
    });

    // optional: force refresh so it’s immediately searchable
    await client.indices.refresh({ index: INDEX_NAME });

    res.status(200).json({
      message: 'Log successfully sent to OpenSearch',
      result: response.body || response
    });
  } catch (err) {
    console.error('Error sending log to OpenSearch:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Optional: fetch recent logs (e.g. for dashboard/testing)
 */
exports.getLogs = async (req, res) => {
  try {
    const size = parseInt(req.query.size) || 10;

    const response = await client.search({
      index: INDEX_NAME,
      body: {
        size,
        sort: [{ "@timestamp": { order: "desc" } }],
        query: { match_all: {} }
      }
    });

    const hits = response.body?.hits?.hits || response.hits?.hits || [];
    res.status(200).json(hits.map(h => h._source));
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ error: err.message });
  }
};
