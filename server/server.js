// server.js — backend for Task Manager

// Import required modules
const express = require('express');     // Web framework for handling HTTP requests
const cors = require('cors');           // Middleware to allow cross-origin requests
const fs = require('fs');               // File system module to read/write files
const path = require('path');           // Utility to handle and resolve file paths

// Set the port (use environment variable or default to 5000)
const PORT = process.env.PORT || 5000;

// Create an Express application
const app = express();

// ─────────────────────────────────────────────────────────────────
// 1) MIDDLEWARE
// ─────────────────────────────────────────────────────────────────

// Parse incoming JSON request bodies
app.use(express.json());

// Enable CORS so frontend (e.g., localhost:5500) can access the backend
app.use(
  cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', `http://localhost:${PORT}`],
  })
);

// Serve static files from the ../frontend directory
// Example: http://localhost:5000/list.html serves ../frontend/list.html
app.use(express.static(path.join(__dirname, '../frontend')));

// ─────────────────────────────────────────────────────────────────
// 2) ROUTES
// ─────────────────────────────────────────────────────────────────

/**
 * GET /read
 * Reads 'data.txt' and returns its contents as a JSON array of items.
 */
app.get('/read', (req, res) => {
  const dataFilePath = path.join(__dirname, 'data.txt'); // Full path to data.txt

  // Read the file asynchronously
  fs.readFile(dataFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data.txt:', err); // Log the error
      return res.status(500).json({ error: 'Failed to read data file' }); // Return 500 on error
    }

    // Split file content by newlines, trim whitespace, and remove empty lines
    const lines = data
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== '');

    // Send items as JSON response
    res.json({ items: lines });
  });
});

/**
 * POST /write
 * Expects JSON body { content: [ 'item1', 'item2', ... ] }
 * Writes content to data.txt, one item per line.
 */
app.post('/write', (req, res) => {
  const content = req.body.content; // Extract content array from request body

  // Validate that content is an array
  if (!Array.isArray(content)) {
    return res.status(400).json({ error: 'Content must be an array of strings' }); // Bad request
  }

  const dataToWrite = content.join('\n'); // Join array into newline-separated string
  const dataFilePath = path.join(__dirname, 'data.txt'); // Full path to data.txt

  // Write the string to the file
  fs.writeFile(dataFilePath, dataToWrite, 'utf8', (err) => {
    if (err) {
      console.error('Error writing to data.txt:', err); // Log the error
      return res.status(500).json({ error: 'Failed to write to data file' }); // Return 500 on error
    }
    res.json({ message: 'Data written successfully' }); // Success response
  });
});

// ─────────────────────────────────────────────────────────────────
// 3) START THE SERVER
// ─────────────────────────────────────────────────────────────────

// Start listening on the specified port
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
