import React, { useState } from "react";
import Navbar from "../components/Navbar";
import "./about.css";

// Profil fotoğrafları import
import ugurImg from "../kullanıcı.png";
import kemalImg from "../kullanıcı.png";
import yasinImg from "../kullanıcı.png";
import erayImg from "../kullanıcı.png";

const About = () => {
  const [language, setLanguage] = useState("tr");

  const content = {
    tr: {
      title: "Hakkımızda",
      description: `Bu proje, yazılım mühendisliği öğrencileri Uğur Can Bayrak, Kemal Özbay, Yasin Aydemir ve Ramis Eray Altıntaş tarafından hayata geçirilmiştir. Amacımız, yapay zekâ ve makine öğrenmesi teknolojilerini spor gibi heyecan verici bir alana entegre ederek, kullanıcı deneyimini farklı bir boyuta taşımaktır. MatchMaster ile futbol artık yalnızca izlenen bir oyun değil; istatistiklerle analiz edilen, tahminlerle şekillenen, quizler ve puan sistemleriyle eğlenceli bir rekabete dönüşen bir deneyimdir. Futbolun teknolojiyle buluştuğu bu yolculukta siz de yerinizi alın!`,
      team: "Takımımız",
      contact: "İletişim: matchmaster@gmail.com",
    },
    en: {
      title: "About Us",
      description: `This project was developed by software engineering students Uğur Can Bayrak, Kemal Özbay, Yasin Aydemir, and Ramis Eray Altıntaş. Our goal is to integrate artificial intelligence and machine learning into the exciting world of sports to elevate the user experience to a whole new level. With MatchMaster, football becomes more than just a game to watch — it becomes an engaging, data-driven experience shaped by predictions, enriched with quizzes, and gamified through a point system. Join us on this journey where football meets technology!`,
      team: "Our Team",
      contact: "Contact: matchmaster@gmail.com",
    }
  };

  return (
    <div className="about-page">
      <Navbar />

      <div className="about-container">
        <h2 className="team-heading">{content[language].team}</h2>
        <div className="members-section">
          <div className="member">
            <img src={ugurImg} alt="Uğur Can Bayrak" />
            <span>Uğur Can Bayrak</span>
          </div>
          <div className="member">
            <img src={kemalImg} alt="Kemal Özbay" />
            <span>Kemal Özbay</span>
          </div>
          <div className="member">
            <img src={yasinImg} alt="Yasin Aydemir" />
            <span>Yasin Aydemir</span>
          </div>
          <div className="member">
            <img src={erayImg} alt="Ramis Eray Altıntaş" />
            <span>Ramis Eray Altıntaş</span>
          </div>
        </div>

        <div className="about-content">
          <div className="language-switch-top-right">
            <button className={language === "tr" ? "active" : ""} onClick={() => setLanguage("tr")}>Türkçe</button>
            <button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>English</button>
          </div>
          <h1 className="about-title">{content[language].title}</h1>
          <p className="about-description">{content[language].description}</p>
          <p className="contact">{content[language].contact}</p>
        </div>
      </div>
    </div>
  );
};

export default About;
