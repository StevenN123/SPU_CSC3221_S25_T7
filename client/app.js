// Imports the HttpClient class we made in Project 1
import HttpClient from './http-client.js';

// 1) Creates a client that points to our local server
const api = new HttpClient('http://localhost:3000');

// 2) Grabs references to the HTML elements we need
const listElement  = document.getElementById('itemList');
const inputElement = document.getElementById('newItem');
const errorElement = document.getElementById('errorMsg');
const addButton    = document.getElementById('addBtn');

/**
 * loadItems()
 * gets the array of items from the server (GET /items) and then shows them on the page
 */
async function loadItems() {
  try {
    const items = await api.get('/items'); // get array from server
    showItems(items);                      // show in the list
    errorElement.textContent = ''; // Clear any previous errors
  } catch (error) {
    console.error('Load error:', error);
    errorElement.textContent = 'Could not load items.';
  }
}

/**
 * showItems(items)
 * Clears the <ul> and then adds each item as an <li>
 */
function showItems(items) {
  // Clears the existing list
  listElement.innerHTML = '';

  // For each string in the items array:
  items.forEach((text, index) => {
    // Creates an <li> and set its text
    const li = document.createElement('li');
    li.textContent = text;

    // Creates a delete button for each item
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✖';   
    deleteBtn.onclick = () => deleteItem(index);

    // Puts the button inside the <li>, then the <li> in the <ul>
    li.appendChild(deleteBtn);
    listElement.appendChild(li);
  });
}

/**
 * saveItems(items)
 * Sends the updated array back to the server POST /items
 */
async function saveItems(items) {
  try {
    await api.post('/items', { body: items }); // Fixed: proper format for your HttpClient
  } catch (error) {
    console.error('Save error:', error);
    errorElement.textContent = 'Could not save changes.';
  }
}

/**
 * addItem()
 * its called when you click "Add"
 * Reads input box, adds to array, saves & re-displays
 */
async function addItem() {
  const newText = inputElement.value.trim(); // get and trim user text

  if (!newText) {
    // If its empty, show a message and stop
    errorElement.textContent = 'Please type something first!';
    return;
  }

  try {
    // 1) get current items
    const items = await api.get('/items');

    // 2) Add our new text
    items.push(newText);

    // 3) Save it back to server
    await saveItems(items);

    // 4) Refresh the displayed list
    showItems(items);

    // 5) Clear input and error message
    inputElement.value = '';
    errorElement.textContent = '';
  } catch (error) {
    console.error('Add item error:', error);
    errorElement.textContent = 'Could not add item.';
  }
}

/**
 * deleteItem(index)
 * Removes the item at position index from the array
 * Saves and updates the UI
 */
async function deleteItem(index) {
  try {
    // Get current items first
    const items = await api.get('/items');
    
    // Remove the item
    items.splice(index, 1);    // remove one element
    
    // Save updated array
    await saveItems(items);    
    
    // Update UI
    showItems(items);
    
    // Clear any error messages
    errorElement.textContent = '';
  } catch (error) {
    console.error('Delete error:', error);
    errorElement.textContent = 'Could not delete item.';
  }
}

// Wires up the Add button
addButton.onclick = addItem;

// Load & display items when page loads
loadItems();
