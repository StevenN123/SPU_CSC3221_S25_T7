// app.js — main front-end logic

// Import the custom HTTP library for making API calls
import HttpLibrary from './httpLibrary.js';

// Create a reusable HTTP client pointing to the backend server at localhost:5000
const client = new HttpLibrary('http://localhost:5000');

// Grab DOM elements for the textarea and the two buttons
const textArea = document.getElementById('output');         // Text area where items are displayed/edited
const getBtn = document.getElementById('get-btn');          // "Get List" button
const updateBtn = document.getElementById('update-btn');    // "Update List" button

/**
 * Event listener for the "Get List" button.
 * When clicked, fetches the list from the server and displays it in the textarea.
 */
getBtn.addEventListener('click', async (e) => {
  e.preventDefault(); // Prevent default form submission behavior if inside a form

  try {
    // Send GET request to /read endpoint; expects a response like { items: [...] }
    const res = await client.get('/read');
    const lines = res.items || []; // Extract items from the response, or use empty array as fallback

    // Clear the current content in the textarea
    textArea.value = '';

    // Append each item from the list to the textarea, one per line
    lines.forEach((item) => {
      textArea.value += `${item}\n`;
    });
  } catch (error) {
    // If there's an error (e.g., network/server issue), log it and alert the user
    console.error('Error fetching list:', error);
    alert('❌ Failed to fetch list from server.');
  }
});

/**
 * Event listener for the "Update List" button.
 * When clicked, reads the textarea content and sends it to the server to overwrite the list.
 */
updateBtn.addEventListener('click', async (e) => {
  e.preventDefault(); // Prevent default form submission behavior if inside a form

  // Read the raw content from the textarea
  const rawText = textArea.value;

  // Split the text by newlines, trim each line, and remove any empty entries
  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l !== '');

  try {
    // Send POST request to /write with the array of lines
    const response = await client.post('/write', { content: lines });

    // Log and alert on success
    console.log('Post success:', response);
    alert('✅ List updated successfully.');
  } catch (error) {
    // Log and alert on failure
    console.error('Error posting data:', error);
    alert('❌ Failed to update list on server.');
  }
});
