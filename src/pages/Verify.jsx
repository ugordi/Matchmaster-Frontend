import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Verify.css";
import logo from "../logo.png";

const Verify = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const email = localStorage.getItem("user_email");

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!code || code.length !== 4) {
      return setError("Geçerli bir 4 haneli kod girin.");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify", {
        email,
        code
      });

      if (res.data.success) {
        setSuccess("✅ Doğrulama başarılı! Anasayfaya yönlendiriliyorsunuz...");

        // ✅ LocalStorage'a kullanıcıyı kaydet
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        setTimeout(() => {
            navigate("/"); // anasayfa
        }, 2000);
        } else {
        setError("Doğrulama başarısız.");
      }
    } catch (err) {
      console.error("Verify error:", err);
      setError(err.response?.data?.error || "Sunucu hatası");
    }
  };

  return (
    <div className="verify-container">
      <div className="verify-card">
        <img src={logo} alt="Logo" className="verify-logo" />
        <h2>Email Doğrulama</h2>
        <p>Lütfen email adresinize gelen 4 haneli kodu girin.</p>

        {error && <div className="verify-error">{error}</div>}
        {success && <div className="verify-success">{success}</div>}

        <form onSubmit={handleVerify}>
          <input
            type="text"
            maxLength={4}
            placeholder="Doğrulama Kodu"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button type="submit">Doğrula</button>
        </form>
        <button className="back-btn" onClick={() => navigate("/signup")}>← Kayıta Geri Dön</button>
      </div>
    </div>
  );
};

export default Verify;
