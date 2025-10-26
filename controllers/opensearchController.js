//controllers/opensearchController.js
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
    const body = req.body;

    if (!body) {
      return res.status(400).json({ error: 'Missing request body' });
    }

    // Normalize to array
    const logs = Array.isArray(body) ? body : [body];

    // Validate structure
    const validLogs = logs.filter(l => l && typeof l === 'object');
    if (!validLogs.length) {
      return res.status(400).json({ error: 'No valid logs found' });
    }

    // Prepare bulk payload for OpenSearch
    const bulkBody = validLogs.flatMap(log => [
      { index: { _index: INDEX_NAME } },
      { ...log, received_at: new Date().toISOString() },
    ]);

    // Send in bulk
    const response = await client.bulk({ refresh: true, body: bulkBody });

    if (response.errors) {
      console.error('Bulk indexing errors:', response.items.filter(i => i.index?.error));
      return res.status(500).json({ error: 'Some logs failed to index', details: response.items });
    }

    res.status(200).json({
      message: `✅ Successfully sent ${validLogs.length} log(s) to OpenSearch`,
    });
  } catch (err) {
    console.error('❌ Error sending logs to OpenSearch:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * Optional: fetch recent logs (for dashboard/testing)
 */
exports.getLogs = async (req, res) => {
  try {
    const size = parseInt(req.query.size) || 10;

    const response = await client.search({
      index: INDEX_NAME,
      body: {
        size,
        sort: [{ "@timestamp": { order: "desc" } }],
        query: { match_all: {} },
      },
    });

    const hits = response.body?.hits?.hits || response.hits?.hits || [];
    res.status(200).json(hits.map(h => h._source));
  } catch (err) {
    console.error('❌ Error fetching logs:', err);
    res.status(500).json({ error: err.message });
  }
};