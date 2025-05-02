import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue
} from '@heroui/react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingKey, setEditingKey] = useState(null);

  const columns = [
    { key: "title", label: "TASK" },
    { key: "status", label: "STATUS" },
    { key: "actions", label: "ACTIONS" },
  ];

  // Filter state
  const [showCompleted, setShowCompleted] = useState(true);
  const [showPending, setShowPending] = useState(true);

  // Fetch tasks based on filters using backend prepared statements
  const fetchTasks = async () => {
    try {
      let endpoint = 'http://localhost:5000/tasks';

      if (!showCompleted && showPending) {
        endpoint = 'http://localhost:5000/tasks/pending';
      } else if (showCompleted && !showPending) {
        endpoint = 'http://localhost:5000/tasks/completed';
      }

      const response = await axios.get(endpoint);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [showCompleted, showPending]);

  // Add a new task
  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const response = await axios.post('http://localhost:5000/tasks', {
          title: newTask,
          status: 'Pending',
        });
        setTasks([...tasks, response.data]);
        setNewTask('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  // Edit an existing task
  const editTask = (id) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setEditingKey(id);
      setNewTask(taskToEdit.title);
    }
  };

  const saveTask = async () => {
    try {
      await axios.put(`http://localhost:5000/tasks/${editingKey}`, {
        title: newTask,
        status: tasks.find((task) => task.id === editingKey).status,
      });
      setEditingKey(null);
      setNewTask('');
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Mark task as complete
  const completeTask = async (id) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, {
        title: tasks.find((task) => task.id === id).title,
        status: 'Completed',
      });
      fetchTasks();
    } catch (error) {
      console.error('Error marking task as complete:', error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '20px',
        backgroundColor: '#f4f4f4',
      }}
    >
      <h1 style={{ marginBottom: '20px', color: '#333' }}>To-Do List</h1>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter task..."
          style={{
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            width: '300px',
          }}
        />
        <button
          onClick={editingKey ? saveTask : addTask}
          style={{
            padding: '10px 15px',
            fontSize: '16px',
            color: '#fff',
            backgroundColor: '#4a90e2',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {editingKey ? 'Save' : 'Add'}
        </button>
      </div>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <label>
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={() => setShowCompleted(!showCompleted)}
            style={{ marginRight: '5px' }}
          />
          Show Completed
        </label>
        <label>
          <input
            type="checkbox"
            checked={showPending}
            onChange={() => setShowPending(!showPending)}
            style={{ marginRight: '5px' }}
          />
          Show Pending
        </label>
      </div>
      <Table
        aria-label="To-Do List Table"
        style={{
          width: '100%',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
        }}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} style={{ textAlign: 'center', ...(column.key === 'actions' && { width: '250px' }) }}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={tasks} emptyContent={"No tasks to display."}>
          {(task) => (
            <TableRow key={task.id}>
              {columns.map((column) => (
                <TableCell key={column.key} style={{ textAlign: 'center' }}>
                  {column.key === "actions" ? (
                    <>
                      <button
                        onClick={() => completeTask(task.id)}
                        style={{
                          margin: '0 5px',
                          padding: '5px 10px',
                          fontSize: '14px',
                          color: '#fff',
                          backgroundColor: '#2ecc71',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => editTask(task.id)}
                        style={{
                          margin: '0 5px',
                          padding: '5px 10px',
                          fontSize: '14px',
                          color: '#fff',
                          backgroundColor: '#f39c12',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        style={{
                          margin: '0 5px',
                          padding: '5px 10px',
                          fontSize: '14px',
                          color: '#fff',
                          backgroundColor: '#e74c3c',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    getKeyValue(task, column.key)
                  )}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default App;