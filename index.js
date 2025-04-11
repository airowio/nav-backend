const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Airow backend is live!');
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
