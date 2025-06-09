import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminQuiz.css';
import AdminSidebar from '../components/adminSidebar';

const AdminQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    question: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'a',
    image_url: ''
  });

  const [editingQuizId, setEditingQuizId] = useState(null);

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/quiz', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setQuizzes(res.data.quizzes);
    } catch (err) {
      console.error('Quiz verileri alınamadı:', err);
    }
  };

  const handleInputChange = (e) => {
    setNewQuiz({ ...newQuiz, [e.target.name]: e.target.value });
  };

  const submitQuiz = async () => {
    try {
      await axios.post('http://localhost:5000/api/admin/quiz', newQuiz, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      resetForm();
      fetchQuizzes();
    } catch (err) {
      console.error('Quiz eklenemedi:', err);
    }
  };

  const deleteQuiz = async (id) => {
    if (!window.confirm('Bu quiz silinsin mi?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/quiz/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchQuizzes();
    } catch (err) {
      console.error('Silinemedi:', err);
    }
  };

  const startEdit = (quiz) => {
    setNewQuiz(quiz);
    setEditingQuizId(quiz.id);
  };

  const updateQuiz = async () => {
    try {
      await axios.put(`http://localhost:5000/api/admin/quiz/${editingQuizId}`, newQuiz, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      resetForm();
      fetchQuizzes();
    } catch (err) {
      console.error('Quiz güncellenemedi:', err);
    }
  };

  const resetForm = () => {
    setNewQuiz({
      question: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_option: 'a',
      image_url: ''
    });
    setEditingQuizId(null);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />

      <main className="admin-main-content">
        <h2 className="admin-title">Quiz Yönetimi</h2>

        <div className="quiz-form-grid">
          <input name="question" value={newQuiz.question} onChange={handleInputChange} placeholder="Soru" />
          <input name="option_a" value={newQuiz.option_a} onChange={handleInputChange} placeholder="Seçenek A" />
          <input name="option_b" value={newQuiz.option_b} onChange={handleInputChange} placeholder="Seçenek B" />
          <input name="option_c" value={newQuiz.option_c} onChange={handleInputChange} placeholder="Seçenek C" />
          <input name="option_d" value={newQuiz.option_d} onChange={handleInputChange} placeholder="Seçenek D" />
          <input name="image_url" value={newQuiz.image_url} onChange={handleInputChange} placeholder="Görsel URL (opsiyonel)" />
          <select name="correct_option" value={newQuiz.correct_option} onChange={handleInputChange}>
            <option value="a">Doğru: A</option>
            <option value="b">Doğru: B</option>
            <option value="c">Doğru: C</option>
            <option value="d">Doğru: D</option>
          </select>
          <div className="quiz-submit">
            {editingQuizId ? (
              <button onClick={updateQuiz}>Güncelle</button>
            ) : (
              <button onClick={submitQuiz}>Ekle</button>
            )}
          </div>
        </div>

        <ul className="quiz-list">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="quiz-item">
              <div className="quiz-question">{quiz.question}</div>
              <ul className="quiz-options">
                <li>A: {quiz.option_a}</li>
                <li>B: {quiz.option_b}</li>
                <li>C: {quiz.option_c}</li>
                <li>D: {quiz.option_d}</li>
              </ul>
              <p><strong>Doğru:</strong> {quiz.correct_option.toUpperCase()}</p>
              {quiz.image_url && <img src={quiz.image_url} alt="quiz" className="quiz-image" />}
              <div className="quiz-actions">
                <button onClick={() => startEdit(quiz)}>Düzenle</button>
                <button onClick={() => deleteQuiz(quiz.id)}>Sil</button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default AdminQuiz;
