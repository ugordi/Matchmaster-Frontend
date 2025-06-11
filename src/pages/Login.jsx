import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import logo from "../logo.png";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Form içi hata mesajı

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password
      });

      const data = res.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/menu");
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.data?.error) {
        setErrorMessage(err.response.data.error); // Özel hata mesajını göster
      } else {
        setErrorMessage("Sunucu hatası. Lütfen daha sonra tekrar deneyin.");
      }
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
          {errorMessage && (
            <div className="form-error">
              {errorMessage}
            </div>
          )}

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

          <button type="submit" className="login-btn animated-btn">
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
