import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../logo.png";
import "./Navbar.css";

const BASE_URL = "http://localhost:5000/api/public";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
      setIsLoggedIn(true);
      setUsername(currentUser.username);
      setIsAdmin(currentUser.isAdmin);
      setProfilePhoto(currentUser.profile_photo_url);
    }
  }, []);

  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    const handleScroll = () => {
      if (window.scrollY > 50) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogoClick = () => {
    const currentUser = localStorage.getItem("user");
    window.location.href = currentUser ? "/" : "/";
  };

  const logout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  const toggleUserMenu = () => setShowMenu(!showMenu);

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
    <nav className="navbar">
      <div className="container">
        <div className="logo" onClick={handleLogoClick}>
          <img src={logo} alt="MatchMaster Logo" />
          <span>MatchMaster</span>
        </div>

        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Takım, lig veya maç ara..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {isLoggedIn ? (
          <>
            <div className="nav-links">
              <a href="/menu">Maçlar</a>
              <a href="/scoreboard">Skor Tablosu</a>
            </div>
            <div className="profile-section">
              <div className="profile-icon">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profil" className="profile-photo" />
                ) : (
                  <span className="default-avatar">👤</span>
                )}
              </div>
              <div className="user-menu">
                <button className="profile-btn" onClick={toggleUserMenu}>
                  <span>{username}</span>
                  <i className="fas fa-chevron-down"></i>
                </button>
                {showMenu && (
                  <div className="dropdown-menu show">
                    <a href="/profile">👤 Profil</a>
                    <a href="/quiz">🧠 Quiz</a>
                    {isAdmin && <a href="/admin">⚙️ Admin Paneli</a>}
                    <a onClick={logout}>🚪 Çıkış Yap</a>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="auth-buttons">
            <button className="animated-btn" onClick={() => navigate("/login")}>Giriş Yap</button>
            <button className="animated-btn" onClick={() => navigate("/signup")}>Kayıt Ol</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
