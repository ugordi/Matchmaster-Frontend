import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // ✅ Navbar component'i import edildi
import "./scoreboard.css";

const Scoreboard = () => {
  const navigate = useNavigate();
  const [monthly, setMonthly] = useState([]);
  const [seasonal, setSeasonal] = useState([]);
  const [myRank, setMyRank] = useState({ monthly: null, seasonal: null });
  const [view, setView] = useState("monthly");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    const fetchScoreboard = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [monthlyRes, seasonalRes, rankRes] = await Promise.all([
          axios.get("http://localhost:5000/api/scoreboard/monthly"),
          axios.get("http://localhost:5000/api/scoreboard/seasonal"),
          axios.get("http://localhost:5000/api/scoreboard/my-rank", { headers }),
        ]);

        setMonthly(monthlyRes.data.list || []);
        setSeasonal(seasonalRes.data.list || []);
        setMyRank(rankRes.data.ranks || {});
      } catch (err) {
        console.error("Skor tablosu yüklenemedi:", err);
      }
    };

    fetchScoreboard();
  }, [navigate]);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim()) {
      const res = await fetch(`/api/teams/search?q=${value}`);
      const data = await res.json();
      if (data.success) console.log("Arama Sonuçları:", data.results);
    }
  };

  const renderLeaderboard = (list, type) =>
    list.map((user, index) => (
      <tr key={user.user_id} className="score-row">
        <td>
          <div className="rank">
            <div className="rank-number">{index + 1}</div>
            <span>{user.first_name} {user.last_name}</span>
          </div>
        </td>
        <td className="point-cell">{type === "monthly" ? user.monthly_points : user.seasonal_points}</td>
      </tr>
    ));

  return (
    <div className="scoreboard-page">
      <Navbar />

      <main className="main-content" style={{ marginTop: "120px" }}>
        <div className="scoreboard-toggle">
          <button
            className={view === "monthly" ? "active" : ""}
            onClick={() => setView("monthly")}
          >
            <i className="fas fa-calendar-alt"></i> Aylık
          </button>
          <button
            className={view === "seasonal" ? "active" : ""}
            onClick={() => setView("seasonal")}
          >
            <i className="fas fa-crown"></i> Sezonluk
          </button>
        </div>

        <div className="scoreboard-container">
          <div className="leaderboard-card">
            <div className="card-header">
              <h2>
                {view === "monthly" ? (
                  <>
                    <i className="fas fa-trophy"></i> Aylık Liderlik
                  </>
                ) : (
                  <>
                    <i className="fas fa-crown"></i> Sezonluk Liderlik
                  </>
                )}
              </h2>
            </div>
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Kullanıcı</th>
                  <th>Puan</th>
                </tr>
              </thead>
              <tbody>
                {view === "monthly"
                  ? renderLeaderboard(monthly, "monthly")
                  : renderLeaderboard(seasonal, "seasonal")}
              </tbody>
            </table>

            {myRank[view] && (
              <div className="my-rank">
                Senin sıralaman: <strong>{myRank[view]}</strong>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Scoreboard;
