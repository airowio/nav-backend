const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

const pingRoute = require('./routes/ping');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/scan', require('./routes/scan'));
app.use('/api/ping', require('./routes/ping'));
//app.use('/api/confirm', require('./routes/confirm'));
//app.use('/api/user', require('./routes/user'));
//app.use('/api/status', require('./routes/status'));

app.get('/', (req, res) => {
  res.send('Airow backend is live!');
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
