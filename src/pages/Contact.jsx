import React from "react";
import Navbar from "../components/Navbar";
import "./contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <Navbar />
      <main className="contact-container">
        <h1 className="contact-title">İletişim</h1>

        <p className="contact-intro">
          Bizimle iletişime geçmekten çekinmeyin! Görüşleriniz, sorularınız ve işbirliği tekliflerinizi memnuniyetle karşılıyoruz.
        </p>

        <div className="contact-grid">
          <div className="contact-box">
            <i className="fas fa-envelope"></i>
            <h3>E-Posta</h3>
            <p>matchaimaster@gmail.com</p>
          </div>

          <div className="contact-box">
            <i className="fas fa-map-marker-alt"></i>
            <h3>Adres</h3>
            <p>Ankara, Türkiye</p>
          </div>

          <div className="contact-box">
            <i className="fas fa-share-alt"></i>
            <h3>Sosyal Medya</h3>
            <p>
              <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">Twitter</a> |{' '}
              <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">LinkedIn</a> |{' '}
              <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">Instagram</a>
            </p>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>İletişim Formu</h2>
          <form className="contact-form">
            <input type="text" placeholder="Adınız" required />
            <input type="email" placeholder="E-posta adresiniz" required />
            <textarea placeholder="Mesajınız" rows="5" required></textarea>
            <button type="submit">Gönder</button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Contact;
