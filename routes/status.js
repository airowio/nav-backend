const express = require('express');
const router = express.Router();
const redis = require('../utils/redis'); // ✅ Use shared client

const { scans } = require('./scan');
const { confirmations } = require('./confirm');
const { sessions } = require('./user');

router.get('/:userEmail', async (req, res) => {
  const userEmail = req.params.userEmail;
  const requestingEmail = req.auth.payload.email;

  // Only allow users to fetch their own status
  if (userEmail !== requestingEmail) {
    return res.status(403).json({ success: false, message: 'Unauthorized to view this status' });
  }

  try {
    // Get pings from Redis
    const rawPings = await redis.lRange(`pings:${userEmail}`, 0, -1);
    const pingInbox = rawPings.map(p => JSON.parse(p));

    const session = sessions?.[userEmail] || null;
    const scan = scans?.[userEmail] || null;

    let confirmation = null;
    if (confirmations) {
      const matchingKey = Object.keys(confirmations).find(key =>
        key.startsWith(`${userEmail}:`)
      );
      if (matchingKey) {
        confirmation = confirmations[matchingKey];
      }
    }

    res.json({
      success: true,
      userEmail,
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
