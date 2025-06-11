import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaRegStar, FaStar } from "react-icons/fa";
import Navbar from "../components/Navbar";
import "./News.css";

const News = () => {
  const [news, setNews] = useState([]);
  const [favoriteNewsIds, setFavoriteNewsIds] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchNews(), fetchFavorites()]);
    };
    loadData();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/public/news");
      setNews(res.data.news);
    } catch (err) {
      console.error("Haberleri getirirken hata:", err);
    }
  };

  const fetchFavorites = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5000/api/profile/favorite-news", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavoriteNewsIds(res.data.news_ids || []);
    } catch (err) {
      console.error("Favori haberleri getirirken hata:", err);
    }
  };

  const toggleFavorite = async (news_id) => {
    if (!token) return alert("Favorilere eklemek için giriş yapmalısınız.");
    try {
      if (favoriteNewsIds.includes(news_id)) {
        await axios.delete(`http://localhost:5000/api/profile/favorite-news/${news_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavoriteNewsIds((prev) => prev.filter((id) => id !== news_id));
      } else {
        await axios.post(`http://localhost:5000/api/profile/favorite-news/${news_id}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavoriteNewsIds((prev) => [...prev, news_id]);
      }
    } catch (err) {
      console.error("Favori işlemi hatası:", err);
    }
  };

  return (
    <div className="news-container">
      <Navbar />
      <h2 className="news-header">Haberler</h2>
      <div className="news-list">
        {news.map((item) => (
          <div key={item.id} className="news-card">
            {item.image_url && (
              <img src={item.image_url} alt="haber" className="news-image" />
            )}
            <div className={`news-content ${!item.image_url ? "no-image" : ""}`}>
              <div className="news-title">{item.title}</div>
              <div className="news-body">{item.content}</div>
              <div className="news-footer">
                <span className="news-league">{item.league_name}</span>
                <span>{new Date(item.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div
              className="favorite-icon"
              onClick={() => toggleFavorite(item.id)}
              title="Favorilere ekle/kaldır"
            >
              {favoriteNewsIds.includes(item.id) ? (
                <FaStar color="#f4c542" size={22} />
              ) : (
                <FaRegStar color="#bbb" size={22} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
