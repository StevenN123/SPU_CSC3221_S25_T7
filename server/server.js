// server.js — backend for Task Manager
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;
const app = express();

// ─────────────────────────────────────────────────────────────────
// 1) MIDDLEWARE
// ─────────────────────────────────────────────────────────────────

// Parse JSON bodies (for POST/PUT)
app.use(express.json());

// Enable CORS so our front-end (served on localhost:5500 or 5000) can talk to this server
app.use(
  cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', `http://localhost:${PORT}`],
  })
);

// Serve all files in ../frontend as static assets
// (so visiting http://localhost:5000/list.html will show your front-end)
app.use(express.static(path.join(__dirname, '../frontend')));

// ─────────────────────────────────────────────────────────────────
// 2) ROUTES
// ─────────────────────────────────────────────────────────────────

/**
 * GET /read
 * Reads data.txt (one item per line) and returns JSON { items: [ ... ] }.
 */
app.get('/read', (req, res) => {
  const dataFilePath = path.join(__dirname, 'data.txt');

  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data.txt:', err);
      return res.status(500).json({ error: 'Failed to read data file' });
    }

    // Split on newline. Filter out any truly empty line.
    const lines = data
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '');

    res.json({ items: lines });
  });
});

/**
 * POST /write
 * Expects body { content: [ 'line1', 'line2', ... ] }
 * Overwrites data.txt with one line per array element.
 */
app.post('/write', (req, res) => {
  const content = req.body.content;

  if (!Array.isArray(content)) {
    return res.status(400).json({ error: 'Content must be an array of strings' });
  }

  const dataToWrite = content.join('\n');
  const dataFilePath = path.join(__dirname, 'data.txt');

  fs.writeFile(dataFilePath, dataToWrite, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to data.txt:', err);
      return res.status(500).json({ error: 'Failed to write to data file' });
    }
    res.json({ message: 'Data written successfully' });
  });
});

// ─────────────────────────────────────────────────────────────────
// 3) START THE SERVER
// ─────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
