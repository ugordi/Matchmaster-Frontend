import React, { useEffect, useState } from "react";
import axios from "axios";
import "./homepage.css";
import Navbar from "../components/Navbar";
import logo from "../logo.png";

const BASE_URL = "http://localhost:5000/api/public";

const Homepage = () => {
  const [news, setNews] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const movingLogos = document.querySelector(".moving-logos");
    const teamLogos = [
      "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",   // Man City
      "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg",               // Liverpool
      "https://upload.wikimedia.org/wikipedia/en/7/7a/Manchester_United_FC_crest.svg", // Man Utd
      "https://img.sofascore.com/api/v1/team/3061/image", // Galatasaray (SVG)
      "https://img.sofascore.com/api/v1/team/3052/image",          // Fenerbahçe 
      "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",              // Real Madrid
      "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg"    // Barcelona
    ];

    teamLogos.forEach((logo) => {
      for (let i = 0; i < 2; i++) {
        const logoDiv = document.createElement("div");
        logoDiv.className = "logo-item";
        logoDiv.style.backgroundImage = `url(${logo})`;
        logoDiv.style.left = `${Math.random() * 100}vw`;
        logoDiv.style.top = `${Math.random() * 100}vh`;
        logoDiv.style.animationDelay = `${Math.random() * 5}s`;
        logoDiv.style.animationDuration = `${30 + Math.random() * 10}s`;
        movingLogos.appendChild(logoDiv);
      }
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newsRes = await axios.get(`${BASE_URL}/news/recent`);
        setNews(newsRes.data.news);

        const statsRes = await axios.get(`${BASE_URL}/site-statistics`);
        setStatistics(statsRes.data);
      } catch (err) {
        console.error("Veriler alınamadı:", err);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value.trim()) {
      try {
        const res = await axios.get(`${BASE_URL}/teams/search?q=${value}`);
        if (res.data.success) {
          console.log("Arama Sonuçları:", res.data.results);
        }
      } catch (err) {
        console.error("Arama hatası:", err);
      }
    }
  };

  return (
    <div className="homepage">
      <div className="moving-logos"></div>
      <Navbar searchTerm={searchTerm} handleSearchChange={handleSearchChange} />

      <main>
        <div className="container">
          <section className="hero-section">
            <div className="hero-content">
              <div className="title-container">
                <div className="header-part">
                  <div className="title-part">
                    <span className="gradient-text">MATCH</span>
                    <span className="gradient-text">MASTER</span>
                  </div>
                  <div className="hero-logo">
                    <img src={logo} alt="MatchMaster Logo" />
                  </div>
                </div>
                <div className="slogan-container">
                  <span className="gradient-text">YAPAY ZEKA</span>
                  <span className="gradient-text">TEKNOLOJİSİ</span>
                  <span className="gradient-text">FUTBOLUN</span>
                  <span className="gradient-text">GELECEĞİ</span>
                </div>
              </div>
            </div>
          </section>

          <section className="stats-chart">
            <div className="stats-tabs">
              <button className="tab-btn active">Genel İstatistikler</button>
            </div>
            <div className="stats-panel active">
              <div className="stats-grid">
                <div className="stat-card">
                  <i className="fas fa-chart-line"></i>
                  <div className="stat-info">
                    <h3>Analiz Edilen Maç</h3>
                    <span className="stat-number">{statistics.total_predictions || 0}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <i className="fas fa-bullseye"></i>
                  <div className="stat-info">
                    <h3>Başarı Oranı</h3>
                    <span className="stat-number">{statistics.success_rate || "0%"}</span>
                  </div>
                </div>
                <div className="stat-card">
                  <i className="fas fa-check-circle"></i>
                  <div className="stat-info">
                    <h3>Doğru Tahmin</h3>
                    <span className="stat-number">{statistics.correct_predictions || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="roadmap-section">
            <h2 className="roadmap-title">🚀 Yol Haritamız</h2>
            <div className="roadmap-container">
              {[
                "Sitenin aktif edilmesi",
                "Sosyal medyada reklamların yapılması",
                "Abonelik & ödeme sisteminin eklenmesi",
                "UEFA Şampiyonlar Ligi, Premier Lig gibi liglerin entegre edilmesi",
                "Mobil uygulamanın çıkarılması"
              ].map((step, index) => (
                <div className="roadmap-step" key={index}>
                  {index !== 0 && <div className="roadmap-arrow" />}
                  <div className="roadmap-player" />
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </section>


          <section className="news-section">
            <h2>Son Haberler</h2>
            <ul className="news-list">
              {news.map((item) => (
                <li key={item.id} className="news-item">
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt="Haber Görseli"
                      className="homepage-news-image"
                    />
                  )}
                  <div className="news-text">
                    <h3>{item.title}</h3>
                    <p>{item.content}</p>
                    <span className="news-date">
                      {new Date(item.created_at).toLocaleDateString("tr-TR")}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <i className="fas fa-chart-line"></i>
              MatchMaster
            </div>
            <div className="footer-links">
              <a href="/about">Hakkımızda</a>
              <a href="/contact">İletişim</a>
              <a href="/privacy">Gizlilik Politikası</a>
              <a href="/termsofuse">Kullanım Şartları</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
