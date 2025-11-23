import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"; // Added useLocation
import { AnimatePresence } from "framer-motion"; // Added AnimatePresence
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Records from "./pages/Records.jsx";
import Clinical from "./pages/Clinical.jsx";
import Consult from "./pages/Consult.jsx";
import CreateProfile from "./pages/CreateProfile.jsx"; 
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Admin from "./pages/Admin.jsx";
import Help from "./pages/Help.jsx";
import TestSupabase from "./pages/TestSupabase.jsx";

import './App.css'

// A wrapper component 
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}> 
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes - All authenticated users */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/records" 
          element={
            <ProtectedRoute>
              <Records />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/clinical" 
          element={
            <ProtectedRoute>
              <Clinical />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/consult" 
          element={
            <ProtectedRoute>
              <Consult />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create" 
          element={
            <ProtectedRoute>
              <CreateProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/help" 
          element={
            <ProtectedRoute>
              <Help />
            </ProtectedRoute>
          } 
        />

        {/* Admin only routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute requiredRole="admin">
              <Admin />
            </ProtectedRoute>
          } 
        />

        {/* Test route */}
        <Route 
          path="/test-supabase" 
          element={
            <ProtectedRoute>
              <TestSupabase />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AnimatePresence>
  );
}


const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Render the animated route wrapper here */}
        <AnimatedRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App