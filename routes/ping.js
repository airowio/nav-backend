// routes/ping.js
const express = require('express');
const router = express.Router();
const checkJwt = require('../middleware/auth');

const pings = {}; // In-memory storage

// Send a ping (🔒 Protected route)
router.post('/', checkJwt, (req, res) => {
  const { senderId, recipientId } = req.body;
  if (!senderId || !recipientId) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  if (!pings[recipientId]) pings[recipientId] = [];
  pings[recipientId].push({
    senderId,
    timestamp: new Date().toISOString()
  });

  res.json({ success: true, message: 'Ping sent', recipientId, senderId });
});

// Get pings for a user (🔓 Public or optional auth later)
router.get('/:userId', (req, res) => {
  const { userId } = req.params;
  res.json({ success: true, pings: pings[userId] || [] });
});

module.exports = { router, pings };
