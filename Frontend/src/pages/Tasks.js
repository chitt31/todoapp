import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';

export default function Tasks({ token, handleLogout }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [error, setError] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log('Fetching tasks with token:', token);
        const response = await axios.get('https://todoapp-2-btbb.onrender.com/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Fetched tasks:', response.data);
        setTasks(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching tasks:', error.response || error);
        setError('Failed to fetch tasks. Please check your connection and try again.');
      }
    };

    if (token) {
      fetchTasks();
    }
  }, [token]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    console.log('Adding task:', newTask);

    try {
      const response = await axios.post('https://todoapp-2-btbb.onrender.com/api/tasks/add',
        { text: newTask },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Task added:', response.data);
      setTasks([...tasks, response.data]);
      setNewTask('');
      setError(null);
    } catch (error) {
      console.error('Error adding task:', error.response || error);
      setError('Failed to add task. Please try again.');
    }
  };

  const handleUpdateTask = async (id) => {
    const taskToUpdate = tasks.find(task => task._id === id);
    if (!taskToUpdate) return;

    try {
      const response = await axios.put(`https://todoapp-2-btbb.onrender.com/api/tasks/${id}`,
        { text: taskToUpdate.text, completed: taskToUpdate.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Task updated:', response.data);
      setTasks(tasks.map(task => task._id === id ? response.data : task));
      setEditingTask(null);
      setError(null);
    } catch (error) {
      console.error('Error updating task:', error.response || error);
      setError('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`https://todoapp-2-btbb.onrender.com/api/tasks/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Task deleted:', id);
      setTasks(tasks.filter(task => task._id !== id));
      setError(null);
    } catch (error) {
      console.error('Error deleting task:', error.response || error);
      setError('Failed to delete task. Please try again.');
    }
  };

  const handleEditTask = (id) => {
    setEditingTask(id);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Tasks</h1>
      <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleAddTask} className={styles.addTaskForm}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task"
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Add Task</button>
      </form>
      <ul className={styles.taskList}>
        {tasks.map(task => (
          <li key={task._id} className={styles.taskItem}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => {
                const updatedTask = { ...task, completed: !task.completed };
                setTasks(tasks.map(t => t._id === task._id ? updatedTask : t));
              }}
              className={styles.checkbox}
            />
            <input
              type="text"
              value={task.text}
              onChange={(e) => {
                const updatedTask = { ...task, text: e.target.value };
                setTasks(tasks.map(t => t._id === task._id ? updatedTask : t));
              }}
              className={`${styles.taskInput} ${task.completed ? styles.completed : ''}`}
              disabled={editingTask !== task._id}
            />
            {editingTask === task._id ? (
              <button onClick={() => handleUpdateTask(task._id)} className={styles.updateButton}>Update</button>
            ) : (
              <button onClick={() => handleEditTask(task._id)} className={styles.editButton}>Edit</button>
            )}
            <button onClick={() => handleDeleteTask(task._id)} className={styles.deleteButton}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
