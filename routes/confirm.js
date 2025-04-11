// routes/confirm.js
const express = require('express');
const router = express.Router();

// Temporary in-memory store for confirmations
const confirmations = new Map();

// POST /api/confirm
router.post('/', (req, res) => {
  const { recipientId, senderId, accepted } = req.body;

  if (!recipientId || !senderId || typeof accepted !== 'boolean') {
    return res.status(400).json({ success: false, message: 'Missing or invalid parameters' });
  }

  const key = `${recipientId}:${senderId}`;
  confirmations.set(key, {
    accepted,
    timestamp: new Date().toISOString()
  });

  return res.json({
    success: true,
    message: `Confirmation ${accepted ? 'accepted' : 'declined'}`,
    recipientId,
    senderId
  });
});

// GET /api/confirm/:recipientId/:senderId
router.get('/:recipientId/:senderId', (req, res) => {
  const { recipientId, senderId } = req.params;
  const key = `${recipientId}:${senderId}`;
  const data = confirmations.get(key);

  if (!data) {
    return res.json({ success: true, confirmed: null });
  }

  // Optionally clear it after retrieval
  confirmations.delete(key);

  return res.json({
    success: true,
    confirmed: data.accepted,
    timestamp: data.timestamp
  });
});

module.exports = router;
