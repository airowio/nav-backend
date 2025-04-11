exports.handleScan = (req, res) => {
    const { userId, locationId } = req.body;
    console.log(`Scan received: User ${userId} at Location ${locationId}`);
    res.json({ success: true, message: 'Scan recorded' });
  };
  