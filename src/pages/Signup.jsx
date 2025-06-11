import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";
import logo from "../logo.png";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    terms: false,
  });

  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // form içi hata mesajı

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (
      !form.first_name ||
      !form.last_name ||
      !form.username ||
      !form.email ||
      !form.password ||
      !form.passwordConfirm
    ) {
      return setErrorMessage("Lütfen tüm alanları doldurun.");
    }

    if (form.password.length < 8) {
      return setErrorMessage("Şifreniz en az 8 karakter uzunluğunda olmalıdır.");
    }

    if (form.password !== form.passwordConfirm) {
      return setErrorMessage("Şifreler eşleşmiyor.");
    }

    if (!form.terms) {
      return setErrorMessage("Kullanım koşullarını kabul etmelisiniz.");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        first_name: form.first_name,
        last_name: form.last_name,
        username: form.username,
        email: form.email,
        password: form.password,
      });

      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify({
          email: form.email,
          username: form.username
        }));
        navigate("/menu");
      } else {
        setErrorMessage(res.data.error || "Bir hata oluştu.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      if (err.response && err.response.data && err.response.data.error) {
        setErrorMessage(err.response.data.error);
      } else {
        setErrorMessage("Sunucu hatası. Lütfen daha sonra tekrar deneyin.");
      }
    }
  };

  return (
    <div className="signup-container">
      <nav className="navbar">
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo} alt="MatchMaster Logo" />
          <span>MatchMaster</span>
        </div>
      </nav>

      <div className="signup-box">
        <div className="signup-header">
          <img src={logo} alt="MatchMaster Logo" className="signup-logo" />
          <h2>Kayıt Ol</h2>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="form-error">
              {errorMessage}
            </div>
          )}

          <div className="input-group">
            <i className="fas fa-user-circle"></i>
            <input
              type="text"
              name="first_name"
              placeholder="Ad"
              value={form.first_name}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <i className="fas fa-user-circle"></i>
            <input
              type="text"
              name="last_name"
              placeholder="Soyad"
              value={form.last_name}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <i className="fas fa-user"></i>
            <input
              type="text"
              name="username"
              placeholder="Kullanıcı Adı"
              value={form.username}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              name="email"
              placeholder="E-posta"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              name="password"
              placeholder="Şifre"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <i className="fas fa-lock"></i>
            <input
              type="password"
              name="passwordConfirm"
              placeholder="Şifre Tekrar"
              value={form.passwordConfirm}
              onChange={handleChange}
            />
          </div>

          <div className="terms">
            <label>
              <input
                type="checkbox"
                name="terms"
                checked={form.terms}
                onChange={handleChange}
              />
              Kullanım koşullarını kabul ediyorum (
              <span className="terms-link" onClick={() => setShowModal(true)}>
                Detaylar
              </span>
              )
            </label>
          </div>

          <button type="submit" className="signup-btn animated-btn">
            Kayıt Ol
          </button>
        </form>

        <div className="login-link">
          Zaten hesabın var mı? <a href="/login">Giriş Yap</a>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Kullanım Koşulları</h3>
            <p>
              Bu uygulamayı kullanarak, sağlanan bilgilerin doğru olduğunu,
              sistemin adil kullanım şartlarına uyacağınızı ve üçüncü şahıslara
              zarar vermeyeceğinizi kabul etmiş olursunuz.
              <br /><br />
              Hesabınız size özeldir, paylaşılması önerilmez. Her türlü kötüye
              kullanım durumunda hesabınız askıya alınabilir.
            </p>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              Kapat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
