import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Quiz from "./pages/Quiz";
import Scoreboard from "./pages/Scoreboard";
import Teams from "./pages/Teams";
import Homepage from "./pages/Homepage";
import Menu from "./pages/Menu";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers"; // ✅ yeni eklendi
import AdminQuiz from "./pages/AdminQuiz";
import AdminNews from "./pages/AdminNews";
import AdminSettings from "./pages/AdminSettings";
import AdminLeagues from "./pages/AdminLeagues";
import AdminTeams from "./pages/AdminTeams";
import AdminMatches from "./pages/AdminMatches";
import About from "./pages/About"


const AppRoutes = () => {
  const [user, setUser] = useState(undefined);
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location.pathname]);

  if (user === undefined) return null;

  const isAdmin = user?.role === "admin";

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<About />} />


      {/* Korumalı rotalar */}
      <Route path="/menu" element={user ? <Menu /> : <Navigate to="/login" />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/quiz" element={user ? <Quiz /> : <Navigate to="/login" />} />
      <Route path="/scoreboard" element={user ? <Scoreboard /> : <Navigate to="/login" />} />
      <Route path="/teams" element={user ? <Teams /> : <Navigate to="/login" />} />
      

      {/* 🔒 Admin rotaları */}
      <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
      <Route path="/admin/users" element={isAdmin ? <AdminUsers /> : <Navigate to="/" />} /> {/* ✅ yeni */}
      <Route path="/admin/quiz" element={isAdmin ? <AdminQuiz /> : <Navigate to="/" />} /> {/* ✅ yeni */}
      <Route path="/admin/news" element={isAdmin ? <AdminNews /> : <Navigate to="/" />} /> {/* ✅ yeni */}
      <Route path="/admin/settings" element={isAdmin ? <AdminSettings /> : <Navigate to="/" />} /> {/* ✅ yeni */}
      <Route path="/admin/leagues" element={isAdmin ? <AdminLeagues /> : <Navigate to="/" />} /> {/* ✅ yeni */}
      <Route path="/admin/teams" element={isAdmin ? <AdminTeams /> : <Navigate to="/" />} /> {/* ✅ yeni */}
      <Route path="/admin/matches" element={isAdmin ? <AdminMatches /> : <Navigate to="/" />} /> {/* ✅ yeni */}



      {/* Diğer durumlar */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const App = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
