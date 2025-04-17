const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

const { router: pingRouter } = require('./routes/ping');
const checkJwt = require('./middleware/auth');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/scan', checkJwt, require('./routes/scan'));
app.use('/api/ping', checkJwt, pingRouter);  // Apply checkJwt middleware at the router level
app.use('/api/confirm', checkJwt, require('./routes/confirm'));
app.use('/api/user', checkJwt, require('./routes/user'));
app.use('/api/status', checkJwt, require('./routes/status'));

app.get('/', (req, res) => {
  res.send('Airow backend is live!');
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
