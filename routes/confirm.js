// routes/confirm.js
const express = require('express');
const router = express.Router();

// Temporary in-memory store for confirmations
const confirmations = new Map();

// POST /api/confirm
router.post('/', (req, res) => {
  const { recipientId, accepted } = req.body;
  const senderEmail = req.auth.payload.email;

  if (!recipientId || typeof accepted !== 'boolean') {
    return res.status(400).json({ success: false, message: 'Missing or invalid parameters' });
  }

  const key = `${recipientId}:${senderEmail}`;
  confirmations.set(key, {
    senderEmail,
    accepted,
    timestamp: new Date().toISOString()
  });

  return res.json({
    success: true,
    message: `Confirmation ${accepted ? 'accepted' : 'declined'}`,
    recipientId,
    senderEmail
  });
});

// GET /api/confirm/:recipientId/:senderEmail
router.get('/:recipientId/:senderEmail', (req, res) => {
  const { recipientId, senderEmail } = req.params;
  const key = `${recipientId}:${senderEmail}`;
  const data = confirmations.get(key);

  if (!data) {
    return res.json({ success: true, confirmed: null });
  }

  // Optionally clear it after retrieval
  confirmations.delete(key);

  return res.json({
    success: true,
    confirmed: data.accepted,
    timestamp: data.timestamp,
    senderEmail: data.senderEmail
  });
});

module.exports = router;
