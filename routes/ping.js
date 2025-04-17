// routes/ping.js
const express = require('express');
const router = express.Router();
const redis = require('../utils/redis');

// Send a ping (🔒 Protected route)
router.post('/', async (req, res) => {
  console.log('Full request auth:', req.auth);
  console.log('Auth payload:', req.auth?.payload);

  const senderEmail = req.auth?.payload?.email;
  const { recipientEmail } = req.body;

  if (!senderEmail || !recipientEmail) {
    return res.status(400).json({ success: false, message: 'Missing sender or recipient email' });
  }

  try {
    const pingData = {
      senderEmail,
      timestamp: new Date().toISOString()
    };

    // Store pings as a Redis list per recipient
    await redis.lPush(`pings:${recipientEmail}`, JSON.stringify(pingData));

    // Set TTL to 24 hours for that ping list
    await redis.expire(`pings:${recipientEmail}`, 60 * 60 * 24); // 24 hours

    res.json({ success: true, message: 'Ping sent', recipientEmail, senderEmail });
  } catch (err) {
    console.error('Redis error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get pings for a user (🔒 Protected route)
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

