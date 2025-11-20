import { BrowserRouter, Routes, Route } from "react-router-dom"; 
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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/records" element={<Records />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/Clinical" element={<Clinical />} />
        <Route path="/Consult" element={<Consult />} />
        <Route path="/create" element={<CreateProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/help" element={<Help />} />
        <Route path="/test-supabase" element={<TestSupabase />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
