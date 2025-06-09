import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminTeams.css';
import AdminSidebar from '../components/adminSidebar';

const AdminTeams = () => {
  const [teams, setTeams] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [form, setForm] = useState({
    name: '',
    logo_url: '',
    coach: '',
    stadium: '',
    info: '',
    league_id: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchTeams = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/teams', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTeams(res.data.teams);
    } catch (err) {
      console.error('Takımlar alınamadı:', err);
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
    fetchTeams();
    fetchLeagues();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/admin/teams/${editingId}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMessage('Takım güncellendi');
      } else {
        await axios.post('http://localhost:5000/api/admin/teams', form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMessage('Takım eklendi');
      }
      setForm({ name: '', logo_url: '', coach: '', stadium: '', info: '', league_id: '' });
      setEditingId(null);
      fetchTeams();
    } catch (err) {
      console.error('İşlem hatası:', err);
    }
  };

  const handleEdit = (team) => {
    setForm({
      name: team.name,
      logo_url: team.logo_url || '',
      coach: team.coach || '',
      stadium: team.stadium || '',
      info: team.info || '',
      league_id: team.league_id || ''
    });
    setEditingId(team.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu takımı silmek istediğinize emin misiniz?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/teams/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchTeams();
    } catch (err) {
      console.error('Silme hatası:', err);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      <main className="admin-main-content">
        <h2 className="admin-title">🏟️ Takım Yönetimi</h2>
        {message && <div className="admin-success-message">{message}</div>}

        <div className="team-form">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Takım Adı" />
          <input name="logo_url" value={form.logo_url} onChange={handleChange} placeholder="Logo URL" />
          <input name="coach" value={form.coach} onChange={handleChange} placeholder="Antrenör" />
          <input name="stadium" value={form.stadium} onChange={handleChange} placeholder="Stadyum" />
          <textarea name="info" value={form.info} onChange={handleChange} placeholder="Açıklama" />
          <select name="league_id" value={form.league_id} onChange={handleChange}>
            <option value="">Lig Seç</option>
            {leagues.map(league => (
              <option key={league.id} value={league.id}>{league.name}</option>
            ))}
          </select>
          <button onClick={handleSubmit}>{editingId ? 'Güncelle' : 'Ekle'}</button>
        </div>

        <div className="team-list">
          {teams.map((team) => (
            <div key={team.id} className="team-card">
              {team.logo_url && <img src={team.logo_url} alt="logo" className="team-logo" />}
              <div className="team-details">
                <h3>{team.name}</h3>
                {team.league_name && <p><strong>Lig:</strong> {team.league_name}</p>}
                {team.coach && <p><strong>Antrenör:</strong> {team.coach}</p>}
                {team.stadium && <p><strong>Stadyum:</strong> {team.stadium}</p>}
                {team.info && <p>{team.info}</p>}
              </div>
              <div className="team-actions">
                <button onClick={() => handleEdit(team)}>Düzenle</button>
                <button onClick={() => handleDelete(team.id)}>Sil</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminTeams;
