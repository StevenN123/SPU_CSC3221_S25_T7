// app.js

import HttpClient from './http-client.js';

const api = new HttpClient('http://localhost:4000'); // ← make sure this matches server.js’s port

const listElement  = document.getElementById('itemList');
const inputElement = document.getElementById('newItem');
const errorElement = document.getElementById('errorMsg');
const addButton    = document.getElementById('addBtn');

/**
 * loadItems()
 * Fetches the array from GET /items and passes it to showItems()
 */
async function loadItems() {
  try {
    const result = await api.get('/items');
    // server returns { items: [...] }
    const items = result.items;
    showItems(items);
    errorElement.textContent = '';
  } catch (err) {
    console.error('Load error:', err);
    errorElement.textContent = 'Could not load items.';
  }
}

/**
 * showItems(items)
 * Clears the <ul> and re-populates with <li> + delete button
 */
function showItems(items) {
  listElement.innerHTML = ''; // clear existing

  items.forEach((text, index) => {
    const li = document.createElement('li');
    li.textContent = text;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '✖';
    deleteBtn.onclick = () => deleteItem(index);

    li.appendChild(deleteBtn);
    listElement.appendChild(li);
  });
}

/**
 * saveItems(items)
 * POSTs { items: [...] } to /items
 */
async function saveItems(items) {
  try {
    await api.post('/items', { items });
  } catch (err) {
    console.error('Save error:', err);
    errorElement.textContent = 'Could not save changes.';
  }
}

/**
 * addItem()
 * Reads input, pushes to array, saves & re-renders
 */
async function addItem() {
  const newText = inputElement.value.trim();
  if (!newText) {
    errorElement.textContent = 'Please type something first!';
    return;
  }

  try {
    const result = await api.get('/items');
    const items = result.items;
    items.push(newText);

    await saveItems(items);
    showItems(items);

    inputElement.value = '';
    errorElement.textContent = '';
  } catch (err) {
    console.error('Add error:', err);
    errorElement.textContent = 'Could not add item.';
  }
}

/**
 * deleteItem(index)
 * Fetches, splices out one entry, saves & re-renders
 */
async function deleteItem(index) {
  try {
    const result = await api.get('/items');
    const items = result.items;

    items.splice(index, 1);
    await saveItems(items);
    showItems(items);
    errorElement.textContent = '';
  } catch (err) {
    console.error('Delete error:', err);
    errorElement.textContent = 'Could not delete item.';
  }
}

// Wire up the “Add” button:
addButton.onclick = addItem;

// Load items immediately when page loads
loadItems();
