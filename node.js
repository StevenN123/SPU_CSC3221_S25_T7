const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Read the list from file
app.get('/items', (req, res) => {
  fs.readFile(FILE, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Could not read data file' });
    res.json(JSON.parse(data || '[]'));
  });
});

// Write the list to file
app.post('/items', (req, res) => {
  fs.writeFile(FILE, JSON.stringify(req.body, null, 2), err => {
    if (err) return res.status(500).json({ error: 'Could not write to file' });
    res.json({ status: 'success' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

