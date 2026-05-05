import { useState } from "react";
import { API_URL } from "../api";

function Login({ setToken, getTasks }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Por favor completa todos los campos");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        getTasks(data.token);
      } else {
        alert("Error en login");
      }

    } catch (error) {
      console.log(error);
      alert("Error de conexión");
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      alert("Por favor completa todos los campos");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.token) {
      setToken(data.token);
      localStorage.setItem("token", data.token);
      getTasks(data.token);
    } else {
      alert(data.message || "Error en registro");
    }

    } catch (error) {
      console.log(error);
      alert("Error de conexión");
    }
  };


  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        Iniciar sesión
      </h1>

      <input
        className="w-full border p-2 mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full border p-2 mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition transform hover:scale-105"
        onClick={handleLogin}
      >
        Login
      </button>

      <button
      className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition mt-2"
      onClick={handleRegister}>
      Registrarse
      </button>
    </div>
  );
}

export default Login;
