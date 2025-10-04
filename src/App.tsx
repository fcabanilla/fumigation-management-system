import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { useAuth } from './hooks/useApi';
import './App.css';

// Tipos para los datos de login
interface LoginData {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResult {
  success: boolean;
  error?: string;
}

function App(): React.JSX.Element {
  const { user, login, logout } = useAuth();
  const isAuthenticated = !!user;

  const handleLogin = async (loginData: LoginData): Promise<LoginResult> => {
    const result = await login(
      loginData.username,
      loginData.password,
      loginData.rememberMe
    );
    return result;
  };

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
                  <Dashboard user={user} onLogout={logout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/"
              element={
                <Navigate
                  to={isAuthenticated ? '/dashboard' : '/login'}
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
