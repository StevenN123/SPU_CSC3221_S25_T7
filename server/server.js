// server.js

/**
 * List Manager Server
 * -------------------
 * This server supports:
 * - GET  /items  → returns JSON { items: [ ... ] }
 * - POST /items  → accepts JSON { items: [ ... ] } and saves them to a file
 *
 * It uses Express for routing, and Node's fs.promises for file I/O.
 */

// Import required modules
const express = require('express');          // Web server framework
const fs = require('fs').promises;           // File system with promises API
const path = require('path');                // For resolving file paths
const cors = require('cors');                // Handles Cross-Origin Resource Sharing (CORS)

// Define constants
const APP_PORT = 4001;                       // Port the server will run on
const DATA_FILENAME = 'items.txt';           // File where list items will be stored
const DATA_PATH = path.join(__dirname, DATA_FILENAME); // Full path to the data file
const ALLOWED_ORIGIN = 'http://127.0.0.1:5500'; // Front-end client origin allowed to access this server

const app = express();                       // Create Express application

// === MIDDLEWARE ===

// Parses incoming JSON request bodies
app.use(express.json());

// Enables CORS to allow only the specified front-end origin
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
  })
);

// === HELPERS ===

/**
 * ensureDataFileExists()
 * Checks if the data file exists, and if not, creates an empty one.
 */
async function ensureDataFileExists() {
  try {
    await fs.access(DATA_PATH);             // Check file accessibility
  } catch (err) {
    if (err.code === 'ENOENT') {            // File does not exist
      await fs.writeFile(DATA_PATH, '', 'utf8'); // Create empty file
    } else {
      throw err;                            // Re-throw unexpected errors
    }
  }
}

/**
 * loadItems()
 * Reads the file and returns an array of non-empty strings.
 */
async function loadItems() {
  await ensureDataFileExists();             // Make sure file exists first
  const raw = await fs.readFile(DATA_PATH, 'utf8'); // Read file content

  // Split by lines, trim whitespace, and remove empty lines
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * saveItems(itemsArray)
 * Overwrites the file with each item on a new line.
 * @param {string[]} itemsArray - Array of strings to be saved
 */
async function saveItems(itemsArray) {
  const data = itemsArray.join('\n');       // Join all items with newline
  await fs.writeFile(DATA_PATH, data, 'utf8'); // Write to file
}

/**
 * validateItemsArray(arr)
 * Validates that input is an array of non-empty strings.
 * Returns an object with { valid, reason }
 */
function validateItemsArray(arr) {
  if (!Array.isArray(arr)) {
    return { valid: false, reason: 'Payload must be an array.' };
  }

  for (let i = 0; i < arr.length; i++) {
    const val = arr[i];
    if (typeof val !== 'string') {
      return { valid: false, reason: `Item at index ${i} is not a string.` };
    }
    if (val.trim().length === 0) {
      return { valid: false, reason: `Item at index ${i} is empty.` };
    }
  }

  return { valid: true, reason: null };     // All items passed validation
}

// === ROUTES ===

/**
 * GET /items
 * Returns the list of items as JSON: { items: [...] }
 */
app.get('/items', async (req, res) => {
  try {
    const items = await loadItems();        // Load items from file
    return res.json({ items });             // Return as JSON
  } catch (err) {
    console.error('Error loading items:', err);
    return res.status(500).json({ error: 'Could not load items.' }); // Server error
  }
});

/**
 * POST /items
 * Accepts JSON { items: [...] }, validates and saves them
 */
app.post('/items', async (req, res) => {
  const { items } = req.body;               // Extract items from request body

  const { valid, reason } = validateItemsArray(items); // Validate input
  if (!valid) {
    return res.status(400).json({ error: reason }); // Return validation error
  }

  try {
    await saveItems(items);                 // Save to file
    return res.json({ message: 'Items saved successfully.' }); // Success
  } catch (err) {
    console.error('Error saving items:', err);
    return res.status(500).json({ error: 'Could not save items.' }); // Server error
  }
});

// Catch-all route for undefined paths
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' }); // 404 handler
});

// === START SERVER ===

// Start listening on defined port
app
  .listen(APP_PORT, () => {
    console.log(`✅  List Manager server listening on http://localhost:${APP_PORT}`);
    console.log(`⚡ Front-end must run at ${ALLOWED_ORIGIN} (or adjust CORS settings).`);
  })
  .on('error', (err) => {
    console.error('Server error:', err);    // Log any server startup errors
  });
