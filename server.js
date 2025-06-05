// server.js

/**
 * List Manager Server
 * -------------------
 * - GET  /items  → returns JSON { items: [ ... ] }
 * - POST /items  → accepts JSON { items: [ ... ] } to overwrite the file
 *
 * Uses express + fs.promises to read/write a plain-text file (one item per line).
 * Validates that each item is a non-empty string.
 */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const APP_PORT = 4000;
const DATA_FILENAME = 'items.txt';               // name of file on disk
const DATA_PATH = path.join(__dirname, DATA_FILENAME);
const ALLOWED_ORIGIN = 'http://127.0.0.1:5500';   // adjust if your client is elsewhere

const app = express();

// === MIDDLEWARE ===
// Parse JSON bodies
app.use(express.json());

// CORS (only allow our front-end origin)
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
  })
);

// === HELPERS ===

/**
 * Ensure the data file exists. If not, create an empty file.
 */
async function ensureDataFileExists() {
  try {
    await fs.access(DATA_PATH);
    // file exists → do nothing
  } catch (err) {
    if (err.code === 'ENOENT') {
      // create an empty file
      await fs.writeFile(DATA_PATH, '', 'utf8');
    } else {
      throw err;
    }
  }
}

/**
 * Load all items from items.txt.
 * Returns an array of non-empty strings.
 */
async function loadItems() {
  await ensureDataFileExists();
  const raw = await fs.readFile(DATA_PATH, 'utf8');
  // split on newline, trim whitespace, filter out empty lines
  return raw
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * Save an array of strings to items.txt, one per line.
 * @param {string[]} itemsArray
 */
async function saveItems(itemsArray) {
  // Join with newline. If array is empty, file becomes empty string.
  const data = itemsArray.join('\n');
  await fs.writeFile(DATA_PATH, data, 'utf8');
}

/**
 * Validate that every element in array is a non-empty string.
 * Returns { valid: boolean, reason: string|null }
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
  return { valid: true, reason: null };
}

// === ROUTES ===

/**
 * GET /items
 *  - Returns all items as JSON: { items: [ ... ] }
 */
app.get('/items', async (req, res) => {
  try {
    const items = await loadItems();
    return res.json({ items });
  } catch (err) {
    console.error('Error loading items:', err);
    return res.status(500).json({ error: 'Could not load items.' });
  }
});

/**
 * POST /items
 *  - Expects JSON body: { items: [ 'item1', 'item2', ... ] }
 *  - Validates array contents, then saves to file.
 */
app.post('/items', async (req, res) => {
  const { items } = req.body;

  // Basic validation
  const { valid, reason } = validateItemsArray(items);
  if (!valid) {
    return res.status(400).json({ error: reason });
  }

  try {
    await saveItems(items);
    return res.json({ message: 'Items saved successfully.' });
  } catch (err) {
    console.error('Error saving items:', err);
    return res.status(500).json({ error: 'Could not save items.' });
  }
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// === START SERVER ===
app
  .listen(APP_PORT, () => {
    console.log(`✅  List Manager server listening on http://localhost:${APP_PORT}`);
    console.log(`⚡ Front-end must run at ${ALLOWED_ORIGIN} (or adjust CORS settings).`);
  })
  .on('error', (err) => {
    console.error('Server error:', err);
  });
