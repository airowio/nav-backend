// File: routes/ping.js
const express = require('express');
const router = express.Router();

// Temporary in-memory store for active pings
const activePings = {}; // Format: { recipientId: [{ senderId, timestamp }] }

// POST /api/ping - Send a ping to another user
router.post('/', (req, res) => {
  const { senderId, recipientId } = req.body;
  if (!senderId || !recipientId) {
    return res.status(400).json({ success: false, message: 'Missing senderId or recipientId' });
  }

  const timestamp = new Date().toISOString();

  if (!activePings[recipientId]) {
    activePings[recipientId] = [];
  }

  activePings[recipientId].push({ senderId, timestamp });

  return res.status(200).json({ success: true, message: 'Ping sent', recipientId, senderId });
});

// GET /api/ping/:userId - Retrieve incoming pings for a user
router.get('/:userId', (req, res) => {
  const { userId } = req.params;

  const pings = activePings[userId] || [];
  // Optionally clear them after fetch (simulate real-time behavior)
  delete activePings[userId];

  return res.status(200).json({ success: true, pings });
});

module.exports = router;
