import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay una sesión guardada al cargar la app
  useEffect(() => {
    // Verificar localStorage primero (recordarme)
    const savedAuth = localStorage.getItem("isAuthenticated");
    const savedUser = localStorage.getItem("user");
    const sessionExpiration = localStorage.getItem("sessionExpiration");
    const rememberMe = localStorage.getItem("rememberMe");

    // Verificar sessionStorage si no hay en localStorage
    const tempAuth = sessionStorage.getItem("isAuthenticated");
    const tempUser = sessionStorage.getItem("user");

    if (savedAuth === "true" && savedUser && rememberMe === "true") {
      // Verificar si la sesión persistente no ha expirado
      if (
        sessionExpiration &&
        new Date().getTime() < parseInt(sessionExpiration)
      ) {
        setIsAuthenticated(true);
        setUser(JSON.parse(savedUser));
      } else {
        // Limpiar sesión expirada
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        localStorage.removeItem("sessionExpiration");
        localStorage.removeItem("rememberMe");
      }
    } else if (tempAuth === "true" && tempUser) {
      // Sesión temporal
      setIsAuthenticated(true);
      setUser(JSON.parse(tempUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);

    if (userData.rememberMe) {
      // Guardar la sesión persistente (30 días)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("sessionExpiration", expirationDate.getTime());
      localStorage.setItem("rememberMe", "true");
    } else {
      // Sesión temporal (se borra al cerrar el navegador)
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // Limpiar ambos tipos de sesión
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    localStorage.removeItem("sessionExpiration");
    localStorage.removeItem("rememberMe");
    sessionStorage.removeItem("isAuthenticated");
    sessionStorage.removeItem("user");
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background:
            "linear-gradient(135deg, #2d5016 0%, #4a7c59 50%, #6b8e23 100%)",
          color: "white",
          fontSize: "1.2rem",
        }}
      >
        Cargando...
      </div>
    );
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route
              path="/login"
              element={
                !isAuthenticated ? (
                  <Login onLogin={handleLogin} />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <Dashboard user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/"
              element={
                <Navigate
                  to={isAuthenticated ? "/dashboard" : "/login"}
                  replace
                />
              }
            />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
