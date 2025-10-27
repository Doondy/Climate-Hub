import React, { useState } from "react";
import "../../styles/EmployeeTasks.css";

function EmployeeTasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Complete project report", priority: "High", completed: false },
    { id: 2, title: "Attend team meeting", priority: "Medium", completed: true },
    { id: 3, title: "Review code submissions", priority: "Low", completed: false },
  ]);

  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("All");

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

  const filteredTasks = tasks.filter((task) => {
    if (filter === "Completed") return task.completed;
    if (filter === "Pending") return !task.completed;
    return true;
  });

  return (
    <div className="employee-tasks">
      <h2>🗂 Employee Task Manager</h2>
      <p className="subtitle">Add, manage, and track your daily work tasks efficiently.</p>

      {/* Task Form */}
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

      {/* Filter */}
      <div className="task-filter">
        <label>Filter Tasks: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Completed</option>
          <option>Pending</option>
        </select>
      </div>

      {/* Task List */}
      <div className="task-list">
        {filteredTasks.map((task) => (
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
              <span className="task-title">{task.title}</span>
              <span className={`priority ${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
            </div>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>
              ❌
            </button>
          </div>
        ))}

        {filteredTasks.length === 0 && <p className="no-tasks">No tasks found.</p>}
      </div>
    </div>
  );
}

export default EmployeeTasks;