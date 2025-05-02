const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Sequelize } = require('sequelize'); // ORM
const Task = require('./models/task'); // ORM Model

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Endpoints

// 🟢 **ORM Usage** - Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.findAll(); // ORM query
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟠 **Prepared Statement Usage** - Get completed tasks
app.get('/tasks/completed', async (req, res) => {
  try {
    const tasks = await Task.sequelize.query(
      "SELECT * FROM tasks WHERE status = ?", // Prepared Statement
      {
        replacements: ["Completed"], // Parameterized Query
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟠 **Prepared Statement Usage** - Get pending tasks
app.get('/tasks/pending', async (req, res) => {
  try {
    const tasks = await Task.sequelize.query(
      "SELECT * FROM tasks WHERE status = ?", // Prepared Statement
      {
        replacements: ["Pending"], // Parameterized Query
        type: Sequelize.QueryTypes.SELECT,
      }
    );
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 **ORM Usage** - Add a new task
app.post('/tasks', async (req, res) => {
  try {
    const { title, status } = req.body;
    const newTask = await Task.create({ title, status }); // ORM method
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 **ORM Usage** - Update a task
app.put('/tasks/:id', async (req, res) => {
  try {
    const { title, status } = req.body;
    const task = await Task.findByPk(req.params.id); // ORM method
    if (task) {
      task.title = title;
      task.status = status;
      await task.save(); // ORM method
      res.json({ message: 'Task updated successfully' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🟢 **ORM Usage** - Delete a task
app.delete('/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id); // ORM method
    if (task) {
      await task.destroy(); // ORM method
      res.json({ message: 'Task deleted successfully' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});