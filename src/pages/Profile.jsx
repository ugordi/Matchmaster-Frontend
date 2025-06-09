import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import defaultUserImage from "../kullanıcı.png";
import "./Profile.css";

const Profile = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios.get("http://localhost:5000/api/profile", config)
      .then(res => setData(res.data))
      .catch((err) => {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          console.error("Profil verisi alınamadı.");
        }
      })
      .finally(() => setLoading(false));
  }, [token, navigate]);

  const toggleFavorite = async (type, id, isFav) => {
    const url = `http://localhost:5000/api/profile/${type}/${id}`;
    try {
      if (isFav) await axios.delete(url, config);
      else await axios.post(url, {}, config);
      const updated = await axios.get("http://localhost:5000/api/profile", config);
      setData(updated.data);
    } catch {
      console.error("Favori güncellenemedi.");
    }
  };

  const handlePasswordChange = async () => {
    try {
      await axios.put("http://localhost:5000/api/profile/change-password", passwordForm, config);
      setSuccessMessage("Şifre başarıyla güncellendi.");
      setPasswordForm({ currentPassword: "", newPassword: "" });
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setSuccessMessage(err.response?.data?.error || "Şifre değiştirme hatası.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (!data) return null;

  const {
    user,
    scores = {},
    quizAvailable,
    predictionStats = {},
    quizStats = {},
    rankings = {},
    favorites = {}
  } = data;

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-main">
        <div className="profile-container">
          <div className="left-section">
            <img
              src={user.profile_photo_url || defaultUserImage}
              alt="Profil"
              className="profile-pic"
            />
            <h1>{user.first_name} {user.last_name}</h1>
            <h2>@{user.username}</h2>
            <p>{user.email}</p>

            {user.role === 'admin' && (
              <button className="admin-panel-button" onClick={() => navigate('/admin')}>
                ⚙️ Admin Paneli
              </button>
            )}

            <div className="profile-info-group">
              <div className="info-row">
                <span>Aylık Puan</span>
                <span>{scores.monthly_points} / Sıra: {rankings.monthly}</span>
              </div>
              <div className="info-row">
                <span>Sezonluk Puan</span>
                <span>{scores.seasonal_points} / Sıra: {rankings.seasonal}</span>
              </div>
              <div className="info-row">
                <span>Quiz Hakkı</span>
                <span>{quizAvailable ? "Evet" : "Hayır"}</span>
              </div>
            </div>

            <div className="stats">
              <div className="stat">
                <span className="label">Tahmin Başarı</span>
                <span className="value">{predictionStats.correct}/{predictionStats.total} (%{predictionStats.successRate})</span>
              </div>
              <div className="stat">
                <span className="label">Quiz Başarı</span>
                <span className="value">{quizStats.correct}/{quizStats.total} (%{quizStats.successRate})</span>
              </div>
            </div>
          </div>

          <div className="right-section">
            <div className="favorites">
              <h3>⭐ Favori Takımlar</h3>
              {favorites.teams.length > 0 ? favorites.teams.map(team => (
                <div key={team.id} className="fav-item">
                  <span>{team.name}</span>
                  <i className="fas fa-star" onClick={() => toggleFavorite("favorite-team", team.id, true)}></i>
                </div>
              )) : <p>Favori takım bulunamadı.</p>}

              <h3>📰 Favori Haberler</h3>
              {favorites.news.length > 0 ? favorites.news.map(news => (
                <div key={news.id} className="fav-item">
                  <span>{news.title}</span>
                  <i className="fas fa-star" onClick={() => toggleFavorite("favorite-news", news.id, true)}></i>
                </div>
              )) : <p>Favori haber bulunamadı.</p>}
            </div>

            <div className="password-change">
              <h3>🔒 Şifre Değiştir</h3>
              <input
                type="password"
                placeholder="Mevcut şifre"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
              <input
                type="password"
                placeholder="Yeni şifre"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
              <button onClick={handlePasswordChange}>Güncelle</button>
              {successMessage && <p className="success-message">{successMessage}</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
