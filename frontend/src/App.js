import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from './Components/Navbar.tsx';
import TaskList from './Pages/TaskList.tsx';
import Dashboard from './Pages/Dashboard.tsx';
import Login from './Pages/Login.tsx';
import Signup from './Pages/Sign-up.tsx';

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
      <Routes>
      <Route exact path="/tasklist" element={<TaskList/>} />
      <Route exact path="/dashboard" element={<Dashboard/>} />
      <Route exact path="/" element={<Login/>} />
      <Route exact path="/Signup" element={<Signup/>} />
          </Routes>
          </div>
    </Router>
  );
};

export default App;
