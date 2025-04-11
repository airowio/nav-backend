// routes/status.js
const express = require('express');
const router = express.Router();

// Import in-memory stores from other route modules
const { scans } = require('./scan');
const { pings } = require('./ping');
const { confirmations } = require('./confirm');
const { sessions } = require('./user');

router.get('/:userId', (req, res) => {
  const userId = req.params.userId;

  // Defensive access with fallback to null
  const session = sessions?.[userId] || null;
  const scan = scans?.[userId] || null;
  const pingInbox = Array.isArray(pings?.[userId]) ? pings[userId] : [];

  // Look for confirmation keyed by "recipientId::senderId"
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
});

module.exports = router;
