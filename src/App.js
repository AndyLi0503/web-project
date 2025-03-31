import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
  Button,
} from '@heroui/react';

function App() {
  const [tasks, setTasks] = useState([]); // Tasks fetched from backend
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

  // Fetch tasks from backend
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks(); // Fetch tasks when the component mounts
  }, []);

  // Add a new task
  const addTask = async () => {
    if (newTask.trim()) {
      try {
        const response = await axios.post('http://localhost:5000/tasks', {
          title: newTask,
          status: 'Pending',
        });
        setTasks([...tasks, response.data]); // Add the new task to the state
        setNewTask('');
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  // Edit an existing task
  const editTask = (key) => {
    const taskToEdit = tasks.find((task) => task.id === key);
    if (taskToEdit) {
      setEditingKey(key);
      setNewTask(taskToEdit.title);
    }
  };

  // Save the edited task
  const saveTask = async () => {
    try {
      await axios.put(`http://localhost:5000/tasks/${editingKey}`, {
        title: newTask,
        status: tasks.find((task) => task.id === editingKey).status,
      });
      setTasks(
        tasks.map((task) =>
          task.id === editingKey ? { ...task, title: newTask } : task
        )
      );
      setEditingKey(null);
      setNewTask('');
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
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
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, status: 'Completed' } : task
        )
      );
    } catch (error) {
      console.error('Error marking task as complete:', error);
    }
  };

  // Filter tasks based on checkboxes
  const filteredTasks = tasks.filter((task) => {
    if (task.status === 'Completed' && !showCompleted) return false;
    if (task.status === 'Pending' && !showPending) return false;
    return true;
  });

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
            <TableColumn
              key={column.key}
              style={{
                textAlign: 'center',
                ...(column.key === 'actions' && { width: '250px' }),
              }}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={filteredTasks}
          emptyContent={"No tasks to display."}
        >
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