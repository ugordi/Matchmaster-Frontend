import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Navbar from "../components/Navbar";
import "./menu.css";

dayjs.extend(utc);
dayjs.extend(timezone);

const BASE_MATCH_URL = "http://localhost:5000/api/matches";
const BASE_PREDICT_URL = "http://localhost:5000/api/predictions";

function Menu() {
  const navigate = useNavigate();
  const [matches, setMatches] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState(1);
  const [lastWeek, setLastWeek] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [userPredictions, setUserPredictions] = useState({});
  const [showBotPredictions, setShowBotPredictions] = useState({});

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) return navigate("/login");
    fetchLeagues();
    fetchUserPredictions();
  }, []);

  useEffect(() => {
    if (selectedLeague) fetchLastWeek(selectedLeague);
  }, [selectedLeague]);

  useEffect(() => {
    if (selectedLeague && selectedWeek) fetchMatches(selectedLeague, selectedWeek);
  }, [selectedWeek, selectedLeague]);

  const fetchLeagues = async () => {
    const res = await axios.get(`${BASE_MATCH_URL}/leagues`);
    if (res.data.success) {
      setLeagues(res.data.leagues);
      const defaultLeague = res.data.leagues.find(l => l.id === 1) || res.data.leagues[0];
      setSelectedLeague(defaultLeague.id);
    }
  };

  const fetchLastWeek = async (league_id) => {
    const res = await axios.get(`${BASE_MATCH_URL}/last-week/${league_id}`);
    if (res.data.success) {
      setLastWeek(res.data.last_week);
      setSelectedWeek(res.data.last_week);
    }
  };

  const fetchMatches = async (league_id, week) => {
    const res = await axios.get(`${BASE_MATCH_URL}/week/${week}?league_id=${league_id}`);
    if (res.data.success) setMatches(res.data.matches);
  };

  const fetchUserPredictions = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await axios.get(BASE_PREDICT_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        const predMap = {};
        res.data.predictions.forEach(pred => {
          predMap[pred.match_id] = pred.predicted_result;
        });
        setUserPredictions(predMap);
      }
    } catch (err) {
      console.error("Tahminler alınamadı:", err);
    }
  };

  const submitPrediction = async (match_id, result) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(BASE_PREDICT_URL, { match_id, predicted_result: result }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserPredictions(prev => ({ ...prev, [match_id]: result }));
    } catch (err) {
      console.error("Tahmin yapılamadı:", err);
    }
  };

  const toggleBotPrediction = (matchId) => {
    setShowBotPredictions(prev => ({ ...prev, [matchId]: !prev[matchId] }));
  };

  const formatMatchDate = (utcDateStr) => {
    return dayjs.utc(utcDateStr).tz("Europe/Istanbul").format("DD MMMM YYYY - HH:mm");
  };

  return (
    <div className="menu-page">
      <Navbar />
      <main className="main-content">
        <div className="container">
          <div className="league-tabs">
            {leagues.map((league) => (
              <button
                key={league.id}
                onClick={() => setSelectedLeague(league.id)}
                className={selectedLeague === league.id ? "active" : ""}
              >
                <img src={league.logo_url} alt={league.name} /> {league.name}
              </button>
            ))}
          </div>

          {lastWeek && (
            <div className="week-dropdown">
              <label>Hafta:</label>
              <select value={selectedWeek} onChange={(e) => setSelectedWeek(Number(e.target.value))}>
                {Array.from({ length: lastWeek }, (_, i) => i + 1).map(week => (
                  <option key={week} value={week}>{week}. Hafta</option>
                ))}
              </select>
            </div>
          )}

          <div className="match-list">
            {matches.length > 0 ? matches.map(match => (
              <div key={match.id} className="match-card">
                <div className="match-top-bar">
                  <span className={`match-status-label ${match.status === 'finished' ? 'finished' : 'upcoming'}`}>
                    {match.status === 'finished' ? "Bitti" : "Yakın"} - {formatMatchDate(match.match_date)}
                  </span>
                </div>

                <div className="match-teams">
                  <div className="team">
                    <img src={match.home_logo || "/logos/default.png"} alt={match.home_team} />
                    <span className="team-name">{match.home_team}</span>
                  </div>
                  <div className="vs-section">
                    <span className="vs">VS</span>
                    {match.status === 'finished' && (
                      <div className="match-score-inline">
                        <span>{match.home_score} - {match.away_score}</span>
                      </div>
                    )}
                  </div>
                  <div className="team">
                    <img src={match.away_logo || "/logos/default.png"} alt={match.away_team} />
                    <span className="team-name">{match.away_team}</span>
                  </div>
                </div>

                {match.status !== 'finished' && (
                  <div className="prediction-buttons">
                    <button
                      className={userPredictions[match.id] === 'home_team' ? 'selected' : ''}
                      onClick={() => submitPrediction(match.id, 'home_team')}
                    >
                      {match.home_team}
                    </button>
                    <button
                      className={userPredictions[match.id] === 'draw' ? 'selected' : ''}
                      onClick={() => submitPrediction(match.id, 'draw')}
                    >
                      Beraberlik
                    </button>
                    <button
                      className={userPredictions[match.id] === 'away_team' ? 'selected' : ''}
                      onClick={() => submitPrediction(match.id, 'away_team')}
                    >
                      {match.away_team}
                    </button>
                  </div>
                )}

                {match.status === 'finished' || showBotPredictions[match.id] ? (
                  <div className="probability-bars">
                    <div className="probability-item">
                      <div className="probability-bar">
                        <div className="probability-fill" style={{ width: `${match.home_win_probability || 35}%` }}></div>
                      </div>
                      <div className="probability-label">{match.home_team} {match.home_win_probability || 35}%</div>
                    </div>
                    <div className="probability-item">
                      <div className="probability-bar">
                        <div className="probability-fill" style={{ width: `${match.draw_probability || 30}%` }}></div>
                      </div>
                      <div className="probability-label">Beraberlik {match.draw_probability || 30}%</div>
                    </div>
                    <div className="probability-item">
                      <div className="probability-bar">
                        <div className="probability-fill" style={{ width: `${match.away_win_probability || 35}%` }}></div>
                      </div>
                      <div className="probability-label">{match.away_team} {match.away_win_probability || 35}%</div>
                    </div>
                  </div>
                ) : (
                  <div className="matchmaster-predict">
                    <button onClick={() => toggleBotPrediction(match.id)} className="bot-predict-btn">
                      🤖 MatchMaster Tahmini
                    </button>
                  </div>
                )}
              </div>
            )) : <p>Maç bulunamadı.</p>}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Menu;
