// app.js — main front-end logic

import HttpLibrary from './httpLibrary.js';

// Create a reusable HTTP client that points to our Express server.
const client = new HttpLibrary('http://localhost:5000');

// Grab DOM elements
const textArea = document.getElementById('output');
const getBtn = document.getElementById('get-btn');
const updateBtn = document.getElementById('update-btn');

/**
 * When the "Get List" button is clicked,
 * fetch the current items from the server and display them.
 */
getBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  try {
    // GET /read → returns { items: [...] }
    const res = await client.get('/read');
    const lines = res.items || [];

    // Clear existing text in the textarea
    textArea.value = '';

    // Populate each line in the textarea
    lines.forEach((item) => {
      textArea.value += `${item}\n`;
    });
  } catch (error) {
    console.error('Error fetching list:', error);
    alert('❌ Failed to fetch list from server.');
  }
});

/**
 * When the "Update List" button is clicked,
 * send the textarea’s content (one line = one item) to the server.
 */
updateBtn.addEventListener('click', async (e) => {
  e.preventDefault();

  // Split on newline and trim out any empty lines
  const rawText = textArea.value;
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l !== '');

  try {
    // POST /write { content: [...] }
    const response = await client.post('/write', { content: lines });
    console.log('Post success:', response);
    alert('✅ List updated successfully.');
  } catch (error) {
    console.error('Error posting data:', error);
    alert('❌ Failed to update list on server.');
  }
});
