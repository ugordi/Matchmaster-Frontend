import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./quiz.css";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noQuestions, setNoQuestions] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:5000";
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || token === "null" || token === "undefined") {
      alert("Giriş yapmanız gerekiyor.");
      return navigate("/login");
    }

    const fetchQuiz = async () => {
      try {
        const statusRes = await axios.get(`${BASE_URL}/api/quiz/user-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!statusRes.data.canTakeQuiz) {
          alert("Bu hafta zaten quiz çözdünüz.");
          return navigate("/profile");
        }

        const quizRes = await axios.get(`${BASE_URL}/api/quiz/available`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!quizRes.data.questions || quizRes.data.questions.length === 0) {
          setNoQuestions(true);
        } else {
          setQuestions(quizRes.data.questions);
        }

        setLoading(false);
      } catch (err) {
        console.error("Quiz yüklenemedi:", err?.response?.data || err.message);
        alert("Bir hata oluştu. Lütfen tekrar giriş yapın.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    };

    fetchQuiz();
  }, [navigate, token]);

  useEffect(() => {
    if (result || noQuestions || loading) return;
    if (timeLeft === 0) {
      handleAnswer(null);
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, result, noQuestions, loading]);

  useEffect(() => {
    const preventExit = (e) => {
      if (!result) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", preventExit);
    return () => window.removeEventListener("beforeunload", preventExit);
  }, [result]);

  const handleAnswer = (option) => {
    const selected = {
      quiz_id: questions[currentIndex].id,
      selected_option: option ?? "null",
    };
    const updatedAnswers = [...answers, selected];
    setAnswers(updatedAnswers);
    setTimeLeft(20);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      submitAnswers(updatedAnswers);
    }
  };

  const submitAnswers = (finalAnswers) => {
    axios
      .post(
        `${BASE_URL}/api/quiz/submit`,
        { answers: finalAnswers },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setResult(res.data);
        setScore((res.data.correct / 10) * 100);
      })
      .catch((err) => {
        console.error("Sonuç gönderilemedi:", err?.response?.data || err.message);
        alert("Cevaplar gönderilirken hata oluştu.");
      });
  };

  const restart = () => window.location.reload();

  if (loading) return <div className="loading">Yükleniyor...</div>;

  if (noQuestions) {
    return (
      <div className="quiz-page">
        <Navbar />
        <div className="quiz-container" style={{ marginTop: "120px" }}>
          <div className="question-card">
            <h2>Bu hafta için henüz quiz soruları eklenmedi.</h2>
            <div className="options-container">
              <button onClick={() => navigate("/profile")} className="option-btn">
                👤 Profil Sayfası
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="quiz-page">
        <Navbar />
        <div className="results-card" style={{ marginTop: "120px" }}>
          <h2>Quiz Tamamlandı!</h2>
          <div className="score-container">
            <div className="score-circle">
              <span className="score-number">{score}%</span>
            </div>
            <p>10 sorudan {result.correct} tanesini doğru yaptınız.</p>
            <p>Kazandığınız Puan: {result.earned}</p>
          </div>
          <div className="result-buttons">
            <button onClick={restart} className="restart-btn">
              🔁 Tekrar Dene
            </button>
            <button onClick={() => navigate("/")} className="home-btn">
              🏠 Ana Sayfa
            </button>
          </div>
        </div>
      </div>
    );
  }

  const current = questions[currentIndex];

  return (
    <div className="quiz-page">
      <Navbar />
      <div className="quiz-container" style={{ marginTop: "120px" }}>
        <div className="question-card">
          <div className="question-number">
            Soru {currentIndex + 1}/{questions.length}
          </div>
          <div className="timer-bar-wrapper">
            <div className="timer-bar" style={{ width: `${(timeLeft / 20) * 100}%` }}></div>
          </div>
          <h2>{current.question}</h2>
          {current.image_url && (
            <img src={current.image_url} alt="Quiz Görseli" className="quiz-image" />
          )}
          <div className="options-container">
            {["A", "B", "C", "D"].map((opt) => (
              <button key={opt} className="option-btn" onClick={() => handleAnswer(opt)}>
                {opt}) {current[`option_${opt.toLowerCase()}`]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
