import { useState } from "react";
import { API_URL } from "../api";
import toast from "react-hot-toast";

function Tasks({ token, tasks, getTasks, setToken, darkMode, setDarkMode }) {
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("all");

  // 👉 NUEVO
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const createTask = async () => {
    if (!title.trim()) {
      toast.error("Por favor escribe una tarea");
      return;
    }

    try {
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
      toast.success("Tarea creada");
    } catch (error) {
      toast.error("Error al crear la tarea");
      console.log(error);
    }
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    getTasks(token);
    toast.success("Tarea eliminada");
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
    toast.success("Estado actualizado");
  };

  // 👉 NUEVO: UPDATE
  const updateTask = async (id) => {
    if (!editText.trim()) {
      toast.error("El título no puede estar vacío");
      return;
    }

    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editText
        })
      });

      setEditingId(null);
      setEditText("");
      getTasks(token);
      toast.success("Tarea actualizada");

    } catch (error) {
      console.log(error);
      toast.error("Error al actualizar");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    toast.success("Sesión cerrada correctamente");
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Mis tareas
        </h2>

        <button
          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Crear tarea */}
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border p-2 rounded-lg dark:bg-gray-700 dark:text-white"
          placeholder="Nueva tarea..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") createTask();
          }}
        />

        <button
          className="bg-green-500 text-white px-4 rounded-lg hover:bg-green-600 transition"
          onClick={createTask}
        >
          +
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded"
        >
          Todas
        </button>

        <button
          onClick={() => setFilter("completed")}
          className="px-3 py-1 bg-green-200 dark:bg-green-600 rounded"
        >
          Completadas
        </button>

        <button
          onClick={() => setFilter("pending")}
          className="px-3 py-1 bg-yellow-200 dark:bg-yellow-600 rounded"
        >
          Pendientes
        </button>
      </div>

      {/* Estado vacío */}
      {tasks.length === 0 && (
        <p className="text-center text-gray-400">
          No tenés tareas todavía 👀
        </p>
      )}

      {/* Lista */}
      <ul className="space-y-3">
        {tasks
          .filter((task) => {
            if (filter === "completed") return task.completed;
            if (filter === "pending") return !task.completed;
            return true;
          })
          .map((task) => (
            <li
              key={task._id}
              className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-3 rounded-xl shadow-sm hover:shadow-md"
            >
              {/* 👉 EDIT MODE */}
              {editingId === task._id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") updateTask(task._id);
                  }}
                  className="flex-1 border p-1 rounded mr-2"
                />
              ) : (
                <span
                  className={
                    task.completed
                      ? "line-through text-gray-400"
                      : "text-gray-800 dark:text-white"
                  }
                >
                  {task.title}
                </span>
              )}

              {/* 👉 BOTONES */}
              {editingId === task._id ? (
                <div className="flex gap-2">
                  <button
                    className="bg-green-400 px-2 rounded-lg"
                    onClick={() => updateTask(task._id)}
                  >
                    💾
                  </button>

                  <button
                    className="bg-gray-400 px-2 rounded-lg"
                    onClick={() => setEditingId(null)}
                  >
                    ❌
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    className="bg-blue-400 px-2 rounded-lg"
                    onClick={() => {
                      setEditingId(task._id);
                      setEditText(task.title);
                    }}
                  >
                    ✏️
                  </button>

                  <button
                    className="bg-yellow-400 px-2 rounded-lg"
                    onClick={() => toggleTask(task._id, task.completed)}
                  >
                    ✓
                  </button>

                  <button
                    className="bg-red-400 px-2 rounded-lg"
                    onClick={() => deleteTask(task._id)}
                  >
                    ✕
                  </button>
                </div>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Tasks;