import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Menu from "./components/Menu";
import Home from "./pages/Home";
import Students from "./pages/Students";
import Contact from "./pages/Contact";
import Login from "./components/Login";
import Register from "./components/Register";
import AuthProvider, { AuthContext } from "./AuthContext";

function App() {
  return (
    <AuthProvider>
      <AuthContent />
    </AuthProvider>
  );
}

function AuthContent() {
  const { isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
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
  );
}

export default App;
