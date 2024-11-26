import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Contact from "./pages/Contact";
import Login from "./components/Login"; // Login page
import Register from "./components/Register"; // Login page
import AuthProvider, { AuthContext } from "./AuthContext"; // Import AuthProvider and AuthContext

function App() {
  const { isAuthenticated, loading } = useContext(AuthContext); // Access loading state

  // Show a loading screen while authentication is being checked
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        {isAuthenticated && <Menu />}
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? <Home /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/students"
            element={
              isAuthenticated ? <Students /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/contact"
            element={
              isAuthenticated ? <Contact /> : <Navigate to="/login" replace />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
