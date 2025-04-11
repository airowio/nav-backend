// routes/user.js
const express = require('express');
const router = express.Router();

// In-memory session store
const sessions = {};

// Create or update a user session
router.post('/', (req, res) => {
  const { userId, displayName } = req.body;
  if (!userId || !displayName) {
    return res.status(400).json({ success: false, message: 'Missing userId or displayName' });
  }

  sessions[userId] = {
    displayName,
    lastSeen: new Date().toISOString()
  };

  res.json({ success: true, message: 'User session recorded', userId });
});

// Retrieve session info
router.get('/:userId', (req, res) => {
  const user = sessions[req.params.userId];
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, session: user });
});

module.exports = router;