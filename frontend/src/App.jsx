import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Subjects from "./pages/Subjects";
import Subject from "./pages/Subject";
import Attendance from "./pages/Attendance";
import Analysis from "./pages/Analysis";
import './App.css'
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/bunk-analysis" element={<Analysis />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/attendance/:id" element={<Subject />} />
        <Route path="/leave-simulator" element={<div>Leave Simulator Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
