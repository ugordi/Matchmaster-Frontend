import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminLeagues.css';
import AdminSidebar from '../components/adminSidebar';

const AdminLeagues = () => {
  const [leagues, setLeagues] = useState([]);
  const [form, setForm] = useState({
    name: '',
    country: '',
    logo_url: '',
    info: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');

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
    fetchLeagues();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/admin/leagues/${editingId}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMessage('Lig güncellendi');
      } else {
        await axios.post('http://localhost:5000/api/admin/leagues', form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setMessage('Lig eklendi');
      }
      setForm({ name: '', country: '', logo_url: '', info: '' });
      setEditingId(null);
      fetchLeagues();
    } catch (err) {
      console.error('İşlem hatası:', err);
    }
  };

  const handleEdit = (league) => {
    setForm({
      name: league.name,
      country: league.country,
      logo_url: league.logo_url || '',
      info: league.info || ''
    });
    setEditingId(league.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu lig silinsin mi?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/leagues/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchLeagues();
    } catch (err) {
      console.error('Silme hatası:', err);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      <main className="admin-main-content">
        <h2 className="admin-title">🏆 Lig Yönetimi</h2>
        {message && <div className="admin-success-message">{message}</div>}

        <div className="league-form">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Lig Adı" />
          <input name="country" value={form.country} onChange={handleChange} placeholder="Ülke" />
          <input name="logo_url" value={form.logo_url} onChange={handleChange} placeholder="Logo URL (opsiyonel)" />
          <textarea name="info" value={form.info} onChange={handleChange} placeholder="Açıklama (opsiyonel)" />
          <button onClick={handleSubmit}>{editingId ? 'Güncelle' : 'Ekle'}</button>
        </div>

        <div className="league-list">
          {leagues.map((league) => (
            <div key={league.id} className="league-card">
              {league.logo_url && <img src={league.logo_url} alt="logo" className="league-logo" />}
              <div className="league-details">
                <h3>{league.name}</h3>
                <p><strong>Ülke:</strong> {league.country}</p>
                {league.info && <p>{league.info}</p>}
              </div>
              <div className="league-actions">
                <button onClick={() => handleEdit(league)}>Düzenle</button>
                <button onClick={() => handleDelete(league.id)}>Sil</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminLeagues;
