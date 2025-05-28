// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Replace this with your actual MongoDB Atlas connection string
const MONGO_URI = 'your_mongodb_atlas_connection_string_here';

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // Parse incoming JSON bodies

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Define the task schema and model
const taskSchema = new mongoose.Schema({
  title: String,        // The task's title
  completed: Boolean    // Whether the task is done
});
const Task = mongoose.model('Task', taskSchema);

// Route to get all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Route to create a new task
app.post('/tasks', async (req, res) => {
  const { title } = req.body;
  const task = new Task({ title, completed: false });
  await task.save();
  res.json(task);
});

// Route to update a task by ID
app.put('/tasks/:id', async (req, res) => {
  const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Route to delete a task by ID
app.delete('/tasks/:id', async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
