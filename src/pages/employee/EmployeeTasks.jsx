import React, { useState } from "react";
import "../../styles/EmployeeTasks.css"; // Create this CSS file

function EmployeeTasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete project report", priority: "High", completed: false },
    { id: 2, title: "Attend team meeting", priority: "Medium", completed: true },
    { id: 3, title: "Review code submissions", priority: "Low", completed: false },
  ]);

  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Medium");

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    const newTaskObj = {
      id: tasks.length + 1,
      title: newTask,
      priority,
      completed: false,
    };
    setTasks([...tasks, newTaskObj]);
    setNewTask("");
  };

  const toggleCompletion = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="employee-tasks">
      <h2>🗂 Employee Tasks</h2>
      <p className="subtitle">Track your assigned tasks and stay productive.</p>

      <div className="task-input">
        <input
          type="text"
          placeholder="Enter a new task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <button onClick={handleAddTask}>➕ Add Task</button>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-item ${task.completed ? "completed" : ""}`}
          >
            <div className="task-info">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleCompletion(task.id)}
              />
              <span>{task.title}</span>
              <span className={`priority ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
            </div>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>
              ❌
            </button>
          </div>
        ))}

        {tasks.length === 0 && <p className="no-tasks">No tasks assigned yet.</p>}
      </div>
    </div>
  );
}

export default EmployeeTasks;