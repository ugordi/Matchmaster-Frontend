import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/adminSidebar';
import './AdminMatches.css';

const AdminMatches = () => {
  const [matches, setMatches] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [form, setForm] = useState({
    home_team: '', away_team: '', match_date: '', match_week: '', league_id: '',
    home_score: '', away_score: '', status: 'upcoming'
  });
  const [predictionForm, setPredictionForm] = useState({
    match_id: '', home_win_probability: '', draw_probability: '', away_win_probability: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [scoreInputs, setScoreInputs] = useState({ match_id: null, home_score: '', away_score: '' });

  useEffect(() => {
    fetchMatches();
    fetchLeagues();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/matches', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMatches(res.data.matches);
    } catch (err) {
      console.error('Maçlar alınamadı:', err);
    }
  };

  const fetchLeagues = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/leagues', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLeagues(res.data.leagues);
    } catch (err) {
      console.error('Ligler alınamadı:', err);
    }
  };

  useEffect(() => {
    const filtered = matches.filter(m => {
      return (
        (!selectedLeague || m.league_id == selectedLeague) &&
        (!selectedWeek || m.match_week == selectedWeek)
      );
    });
    setFilteredMatches(filtered);
  }, [matches, selectedLeague, selectedWeek]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePredictionChange = (e) => {
    setPredictionForm({ ...predictionForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        match_date: new Date(form.match_date).toISOString().slice(0, 19).replace('T', ' ')
      };
      if (editingId) {
        await axios.put(`http://localhost:5000/api/admin/matches/${editingId}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/admin/matches', payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      setForm({ home_team: '', away_team: '', match_date: '', match_week: '', league_id: '', home_score: '', away_score: '', status: 'upcoming' });
      setEditingId(null);
      fetchMatches();
    } catch (err) {
      console.error('Kaydetme hatası:', err);
    }
  };

  const handleEdit = (match) => {
    setForm({
      home_team: match.home_team,
      away_team: match.away_team,
      match_date: match.match_date.slice(0, 16),
      match_week: match.match_week || '',
      league_id: match.league_id || '',
      home_score: match.home_score || '',
      away_score: match.away_score || '',
      status: match.status || 'upcoming'
    });
    setEditingId(match.id);
    setPredictionForm({
      match_id: match.id,
      home_win_probability: '',
      draw_probability: '',
      away_win_probability: ''
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu maçı silmek istediğinizden emin misiniz?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/matches/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchMatches();
    } catch (err) {
      console.error('Silme hatası:', err);
    }
  };

  const handlePredictionSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/admin/match-predictions', predictionForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Tahmin başarıyla kaydedildi');
    } catch (err) {
      console.error('Tahmin kaydedilemedi:', err);
    }
  };

  const handleScoreFinish = (matchId) => {
    setScoreInputs({ match_id: matchId, home_score: '', away_score: '' });
    setShowScoreModal(true);
  };

  const handleScoreSubmit = async () => {
    try {
      await axios.post('http://localhost:5000/api/admin/finish-match', scoreInputs, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setShowScoreModal(false);
      fetchMatches();
    } catch (err) {
      console.error('Maçı bitirme hatası:', err);
    }
  };

  return (
    <div className="admin-matches-container">
      <AdminSidebar />
      <main className="admin-matches-content">
        <h2 className="admin-matches-title">⚽ Maç Yönetimi</h2>
        <div className="admin-matches-filters">
          <select value={selectedLeague} onChange={(e) => setSelectedLeague(e.target.value)}>
            <option value="">Tüm Ligler</option>
            {leagues.map(league => (
              <option key={league.id} value={league.id}>{league.name}</option>
            ))}
          </select>
          <select value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)}>
            <option value="">Tüm Haftalar</option>
            {[...Array(38)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}. Hafta</option>
            ))}
          </select>
        </div>

        <div className="admin-matches-form">
          <input name="home_team" value={form.home_team} onChange={handleChange} placeholder="Ev Sahibi" />
          <input name="away_team" value={form.away_team} onChange={handleChange} placeholder="Deplasman" />
          <input name="match_date" type="datetime-local" value={form.match_date} onChange={handleChange} />
          <input name="match_week" value={form.match_week} onChange={handleChange} placeholder="Hafta" />
          <select name="league_id" value={form.league_id} onChange={handleChange}>
            <option value="">Lig Seç</option>
            {leagues.map(league => (
              <option key={league.id} value={league.id}>{league.name}</option>
            ))}
          </select>
          <input name="home_score" value={form.home_score} onChange={handleChange} placeholder="Ev Skoru" />
          <input name="away_score" value={form.away_score} onChange={handleChange} placeholder="Dep Skoru" />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="upcoming">Yaklaşan</option>
            <option value="finished">Tamamlandı</option>
          </select>
          <button onClick={handleSubmit}>{editingId ? 'Güncelle' : 'Ekle'}</button>
        </div>

        {editingId && (
          <div className="admin-matches-prediction-form">
            <h4>Sistem Tahmini</h4>
            <input name="home_win_probability" value={predictionForm.home_win_probability} onChange={handlePredictionChange} placeholder="Ev Kazanma (%)" />
            <input name="draw_probability" value={predictionForm.draw_probability} onChange={handlePredictionChange} placeholder="Beraberlik (%)" />
            <input name="away_win_probability" value={predictionForm.away_win_probability} onChange={handlePredictionChange} placeholder="Deplasman Kazanma (%)" />
            <button onClick={handlePredictionSubmit}>Tahmini Kaydet</button>
          </div>
        )}

        {showScoreModal && (
          <div className="modal">
            <div>
              <h3>Maç Skoru Gir</h3>
              <input
                type="number"
                placeholder="Ev Sahibi Skoru"
                value={scoreInputs.home_score}
                onChange={(e) => setScoreInputs({ ...scoreInputs, home_score: e.target.value })}
              />
              <input
                type="number"
                placeholder="Deplasman Skoru"
                value={scoreInputs.away_score}
                onChange={(e) => setScoreInputs({ ...scoreInputs, away_score: e.target.value })}
              />
              <button onClick={handleScoreSubmit}>Kaydet ve Bitir</button>
              <button onClick={() => setShowScoreModal(false)}>İptal</button>
            </div>
          </div>
        )}

        <div className="admin-matches-list">
          {filteredMatches.map((match) => (
            <div key={match.id} className="admin-matches-card">
              <div className="admin-matches-info">
                <p><strong>{match.home_team}</strong> vs <strong>{match.away_team}</strong></p>
                <p>{new Date(match.match_date).toLocaleString('tr-TR')}</p>
                <p>{match.league_name} - {match.match_week}. Hafta</p>
                <p>Durum: {match.status}</p>
                {match.home_score !== null && match.away_score !== null && (
                  <p>Skor: {match.home_score} - {match.away_score}</p>
                )}
              </div>
              <div className="admin-matches-actions">
                <button onClick={() => handleEdit(match)}>Düzenle</button>
                <button onClick={() => handleDelete(match.id)}>Sil</button>
                {match.status === 'upcoming' && (
                  <button onClick={() => handleScoreFinish(match.id)}>Maçı Bitir</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminMatches;
