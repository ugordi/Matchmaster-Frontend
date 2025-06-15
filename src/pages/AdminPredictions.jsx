import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/adminSidebar";
import "./AdminPredictions.css";

const AdminPredictions = () => {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [summary, setSummary] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const matchesPerPage = 10;

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/matches", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setMatches(res.data.matches);
    } catch (err) {
      console.error("Maçlar alınamadı:", err);
    }
  };

  const fetchPredictionsForMatch = async (matchId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/predictions/${matchId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setPredictions(res.data.predictions);
      setSummary(res.data.summary);
    } catch (err) {
      console.error("Tahminler alınamadı:", err);
    }
  };

    // Pagination için
    const indexOfLastMatch = currentPage * matchesPerPage;
    const indexOfFirstMatch = indexOfLastMatch - matchesPerPage;
    const currentMatches = matches.slice(indexOfFirstMatch, indexOfLastMatch);
    const totalPages = Math.ceil(matches.length / matchesPerPage);

    
  return (
    <div className="admin-predictions-page">
      <AdminSidebar />
      <main className="admin-predictions-main-content">
        <h2 className="admin-predictions-title">📊 Tahminler</h2>

        <div className="admin-predictions-match-list">
          <h3 className="admin-predictions-subtitle">Maçlar</h3>
          <ul className="admin-predictions-ul">
            {currentMatches.map(match => (
              <li
                key={match.id}
                className={`admin-predictions-match-item ${selectedMatch?.id === match.id ? "admin-predictions-selected" : ""}`}
                onClick={() => {
                  setSelectedMatch(match);
                  fetchPredictionsForMatch(match.id);
                }}
              >
                {match.home_team} vs {match.away_team} ({new Date(match.match_date).toLocaleDateString("tr-TR")})
              </li>
            ))}
          </ul>
          <div className="admin-pagination">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`admin-pagination-btn${currentPage === i + 1 ? " active" : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {selectedMatch && (
          <div className="admin-predictions-details">
            <h3 className="admin-predictions-match-title">
              {selectedMatch.home_team} vs {selectedMatch.away_team}
            </h3>

            {summary && (
              <div className="admin-predictions-summary">
                <p><strong>Ev Sahibi Galibiyeti:</strong> %{summary.home_win}</p>
                <p><strong>Beraberlik:</strong> %{summary.draw}</p>
                <p><strong>Deplasman Galibiyeti:</strong> %{summary.away_win}</p>
              </div>
            )}

            <table className="admin-predictions-table">
              <thead>
                <tr>
                  <th>Kullanıcı</th>
                  <th>Ev Sahibi</th>
                  <th>Deplasman</th>
                  <th>Seçilen Tahmin</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map(pred => (
                  <tr key={pred.id}>
                    <td>{pred.username}</td>
                    <td>{selectedMatch.home_team}</td>
                    <td>{selectedMatch.away_team}</td>
                    <td>
                      {pred.prediction === "home" ? "Ev Sahibi" :
                        pred.prediction === "draw" ? "Beraberlik" :
                          "Deplasman"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPredictions;
