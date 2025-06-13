import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import { FaStar, FaRegStar } from "react-icons/fa";
import "./teams.css";

const BASE_URL = "http://localhost:5000/api";

const TeamPage = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteTeams, setFavoriteTeams] = useState([]);

  const fetchFavoriteTeams = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/profile/favorite-teams`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFavoriteTeams(res.data.team_ids || []);
    } catch (err) {
      console.error("Favori takımlar alınamadı:", err);
    }
  };

  const toggleFavorite = async () => {
    const isFav = favoriteTeams.includes(parseInt(id));
    const token = localStorage.getItem("token");

    try {
      if (isFav) {
        // DELETE istekleri sadece URL ve config alır
        await axios.delete(`${BASE_URL}/profile/favorite-team/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavoriteTeams((prev) => prev.filter((tid) => tid !== parseInt(id)));
      } else {
        await axios.post(`${BASE_URL}/profile/favorite-team/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavoriteTeams((prev) => [...prev, parseInt(id)]);
      }
    } catch (err) {
      console.error("Favori takım güncellenemedi:", err);
    }
  };

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const teamRes = await axios.get(`${BASE_URL}/team/${id}`);
        setTeam(teamRes.data.team);

        const matchesRes = await axios.get(`${BASE_URL}/team/${id}/matches`);
        setMatches(matchesRes.data.matches);
      } catch (err) {
        console.error("Takım verisi çekilemedi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
    fetchFavoriteTeams();
  }, [id]);

  if (loading) return <div className="team-page-loading">Yükleniyor...</div>;
  if (!team) return <div className="team-page-error">Takım bulunamadı.</div>;

  const isFavorite = favoriteTeams.includes(parseInt(id));

  return (
    <>
      <Navbar />
      <div className="team-page-container">
        <div className="team-header-combined">
          <img src={team.logo_url} alt={team.name} className="team-logo" />
          <div className="team-header-details">
            <div className="team-title-row">
              <h1>{team.name}</h1>
              <button className="fav-btn" onClick={toggleFavorite}>
                {isFavorite ? (
                  <FaStar className="fav-icon filled" />
                ) : (
                  <FaRegStar className="fav-icon" />
                )}
              </button>
            </div>
            {team.standing && (
              <p className="standing-info">
                📊 {team.standing.matches_played} Maç | {team.standing.wins}G {team.standing.draws}B {team.standing.losses}M | {team.standing.points} Puan
              </p>
            )}
            <p className="coach-stadium">
              👤 {team.coach} &nbsp;&nbsp;|&nbsp;&nbsp; 🏟️ {team.stadium}
            </p>
            <div className="team-info-short">
              <h2>Takım Hakkında</h2>
              <p>{team.info || "Açıklama bulunmuyor."}</p>
            </div>
          </div>
        </div>

        <div className="team-matches-box">
          <h2>Maçlar</h2>
          {matches.length === 0 ? (
            <p>Bu takıma ait maç bulunamadı.</p>
          ) : (
            <ul className="match-list">
              {matches.map((match) => (
                <li key={match.id} className="match-item">
                  <div className="match-team">
                    <img src={match.home_logo} alt={match.home_team} className="team-mini-logo" />
                    <span className="team-name">{match.home_team}</span>
                  </div>
                  <div className="match-score">
                    {match.status === "finished" ? (
                      <strong>{match.home_score} - {match.away_score}</strong>
                    ) : (
                      <em>Yaklaşan Maç</em>
                    )}
                    <div className="match-date">{match.match_date.slice(0, 10)}</div>
                  </div>
                  <div className="match-team">
                    <span className="team-name">{match.away_team}</span>
                    <img src={match.away_logo} alt={match.away_team} className="team-mini-logo" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
};

export default TeamPage;
