import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'; // ✅ Navbar bileşeni
import "./teams.css";

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchAllTeams();
    fetchFavoriteTeams();
  }, []);

  const fetchAllTeams = async () => {
    try {
      const response = await axios.get('/api/teams');
      setTeams(response.data);
    } catch (error) {
      console.error('Tüm takımlar alınırken hata:', error);
    }
  };

  const fetchFavoriteTeams = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get('/api/favorites', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFavorites(response.data);
    } catch (error) {
      console.error('Favori takımlar alınırken hata:', error);
    }
  };

  const renderTeamCard = (team) => (
    <div key={team.id} className="team-card">
      <img src={team.logo_url} alt={team.name} className="team-logo" />
      <span className="team-name">{team.name}</span>
    </div>
  );

  return (
    <div className="teams-page">
      <Navbar />
      <main className="teams-main" style={{ marginTop: "120px" }}>
        <section className="favorites-section">
          <h2>⭐ Favori Takımlarım</h2>
          <div className="teams-grid">
            {favorites.length > 0 ? favorites.map(renderTeamCard) : <p>Henüz favori takımınız yok.</p>}
          </div>
        </section>

        <section className="all-teams-section">
          <h2>📋 Tüm Takımlar</h2>
          <div className="teams-grid">
            {teams.length > 0 ? teams.map(renderTeamCard) : <p>Yükleniyor...</p>}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Teams;
