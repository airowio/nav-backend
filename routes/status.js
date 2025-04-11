const express = require('express');
const router = express.Router();
const redis = require('../utils/redis'); // ✅ Use shared client

const { scans } = require('./scan');
const { confirmations } = require('./confirm');
const { sessions } = require('./user');

router.get('/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    // Get pings from Redis
    const rawPings = await redis.lRange(`pings:${userId}`, 0, -1);
    const pingInbox = rawPings.map(p => JSON.parse(p));

    const session = sessions?.[userId] || null;
    const scan = scans?.[userId] || null;

    let confirmation = null;
    if (confirmations) {
      const matchingKey = Object.keys(confirmations).find(key =>
        key.startsWith(`${userId}::`)
      );
      if (matchingKey) {
        confirmation = confirmations[matchingKey];
      }
    }

    res.json({
      success: true,
      userId,
      session,
      lastScan: scan,
      pendingPings: pingInbox,
      confirmation
    });
  } catch (err) {
    console.error('Redis fetch error in status:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch status' });
  }
});

module.exports = router;
