import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Dashboard from "./pages/Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import Records from "./pages/Records.jsx";
import Clinical from "./pages/Clinical.jsx";
import Consult from "./pages/Consult.jsx";

import './App.css'

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/records" element={<Records />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Clinical" element={<Clinical />} />
          <Route path="/Consult" element={<Consult />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App
