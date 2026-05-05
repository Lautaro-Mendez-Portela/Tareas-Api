import { useState } from "react";
import { API_URL } from "../api";

function Tasks({ token, tasks, getTasks, setToken, darkMode, setDarkMode }) {
  const [title, setTitle] = useState("");

  const createTask = async () => {
    if (!title) return;

    await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        title,
        completed: false
      })
    });

    setTitle("");
    getTasks(token);
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    getTasks(token);
  };

  const toggleTask = async (id, completed) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        completed: !completed
      })
    });

    getTasks(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Mis tareas
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setDarkMode(prev => !prev)}
            className="bg-gray-300 dark:bg-gray-700 px-3 py-1 rounded-lg transition"
          >
            🌙
          </button>

          <button
            className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Crear tarea */}
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 dark:bg-gray-700 dark:text-white"
          placeholder="Nueva tarea..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button
          className="bg-green-500 text-white px-4 rounded-lg hover:bg-green-600 transition transform hover:scale-105"
          onClick={createTask}
        >
          +
        </button>
      </div>

      {/* Lista */}
      <ul className="space-y-3">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-xl shadow-sm transition hover:shadow-md hover:scale-[1.02]"
          >
            <span
              className={
                task.completed
                  ? "line-through text-gray-400"
                  : "text-gray-800 dark:text-white"
              }
            >
              {task.title}
            </span>

            <div className="flex gap-2">
              <button
                className="bg-yellow-400 px-2 rounded-lg hover:bg-yellow-500"
                onClick={() => toggleTask(task._id, task.completed)}
              >
                ✓
              </button>

              <button
                className="bg-red-400 px-2 rounded-lg hover:bg-red-500"
                onClick={() => deleteTask(task._id)}
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;
