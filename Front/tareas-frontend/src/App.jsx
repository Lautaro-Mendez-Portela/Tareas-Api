import { useState, useEffect } from "react";
import Login from "./components/Login";
import Tasks from "./components/Tasks";
import { API_URL } from "./api";

function App() {
  const [token, setToken] = useState("");
  const [tasks, setTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const getTasks = async (token) => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      setTasks(data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
      getTasks(savedToken);
    }
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition">
        <div className="w-full max-w-xl bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transition">

          {!token ? (
            <Login setToken={setToken} getTasks={getTasks} />
          ) : (
            <Tasks
              token={token}
              tasks={tasks}
              getTasks={getTasks}
              setToken={setToken}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
