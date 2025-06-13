import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "../logo.png";
import "./Navbar.css";

const BASE_URL = "http://localhost:5000/api";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef();

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoClick = () => {
    window.location.href = "/";
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

    if (value.trim().length === 0) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}/team/search?q=${value}`);
      if (res.data.success) {
        setSearchResults(res.data.results.slice(0, 8));
        setShowDropdown(true);
      }
    } catch (err) {
      console.error("Arama hatası:", err);
    }
  };

  const handleResultClick = (teamId) => {
    setSearchTerm("");
    setSearchResults([]);
    setShowDropdown(false);
    navigate(`/team/${teamId}`);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo" onClick={handleLogoClick}>
          <img src={logo} alt="MatchMaster Logo" />
          <span>MatchMaster</span>
        </div>

        <div className="search-box" ref={dropdownRef}>
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Takım ara..."
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => {
              if (searchResults.length > 0) setShowDropdown(true);
            }}
          />
          {showDropdown && searchResults.length > 0 && (
            <ul className="search-dropdown">
              {searchResults.map((team) => (
                <li key={team.id} onClick={() => handleResultClick(team.id)}>
                  <img src={team.logo_url} alt={team.name} />
                  <span>{team.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {isLoggedIn ? (
          <>
            <div className="nav-links">
              <a href="/menu">Maçlar</a>
              <a href="/news">Haberler</a>
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
