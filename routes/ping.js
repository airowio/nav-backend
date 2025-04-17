// routes/ping.js
const express = require('express');
const router = express.Router();
const checkJwt = require('../middleware/auth');
// Initialize Redis client
const redis = require('../utils/redis');




// Send a ping (🔒 Protected route)
router.post('/', checkJwt, async (req, res) => {
  const { recipientId } = req.body;
  const senderEmail = req.auth.payload.email;

  if (!recipientId) {
    return res.status(400).json({ success: false, message: 'Missing recipient email' });
  }

  try {
    const pingData = {
      senderEmail,
      timestamp: new Date().toISOString()
    };

    // Store pings as a Redis list per recipient
    await redis.lPush(`pings:${recipientId}`, JSON.stringify(pingData));

    // Set TTL to 24 hours for that ping list
    await redis.expire(`pings:${recipientId}`, 60 * 60 * 24); // 24 hours

    res.json({ success: true, message: 'Ping sent', recipientId, senderEmail });
  } catch (err) {
    console.error('Redis error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get pings for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const rawPings = await redis.lRange(`pings:${userId}`, 0, -1);
    const pings = rawPings.map(p => JSON.parse(p));

    res.json({ success: true, pings });
  } catch (err) {
    console.error('Redis fetch error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch pings' });
  }
});

module.exports = { router };

