import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import logo from "../logo.png"; // LOGO BURADA İMPORT EDİLDİ

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Lütfen tüm alanları doldurun");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      const data = res.data;

      // Token ve kullanıcı bilgisi localStorage'a yazılır
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Giriş sonrası yönlendirme
      navigate("/menu");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Sunucu hatası");
    }
  };

  return (
    <div className="login-container">
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo} alt="Logo" />
          <span>MatchMaster</span>
        </div>
      </nav>

      <div className="login-box">
        <div className="login-header">
          <img src={logo} alt="MatchMaster Logo" className="login-logo" />
          <h2>Giriş Yap</h2>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              name="email"
              placeholder="E-posta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              name="password"
              placeholder="Şifre"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn">
            Giriş Yap
          </button>
        </form>

        <div className="signup-link">
          Hesabınız yok mu? <a href="/signup">Kayıt Ol</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
