import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminNews.css';
import AdminSidebar from '../components/adminSidebar';

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [leagues, setLeagues] = useState([]);
  const [form, setForm] = useState({
    title: '',
    content: '',
    league_id: '',
    image_url: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchNews = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/news', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNews(res.data.news);
    } catch (err) {
      console.error("Haberler alınamadı:", err);
    }
  };

  const fetchLeagues = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/leagues', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setLeagues(res.data.leagues);
    } catch (err) {
      console.error("Ligler alınamadı:", err);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchLeagues();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/admin/news/${editingId}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } else {
        await axios.post('http://localhost:5000/api/admin/news', form, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      }
      setForm({ title: '', content: '', league_id: '', image_url: '' });
      setEditingId(null);
      fetchNews();
    } catch (err) {
      console.error("Haber kaydedilemedi:", err);
    }
  };

  const deleteNews = async (id) => {
    if (!window.confirm('Bu haberi silmek istediğinize emin misiniz?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/news/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchNews();
    } catch (err) {
      console.error("Silinemedi:", err);
    }
  };

  const startEdit = (newsItem) => {
    setForm({
      title: newsItem.title,
      content: newsItem.content,
      league_id: newsItem.league_id || '',
      image_url: newsItem.image_url || ''
    });
    setEditingId(newsItem.id);
  };

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />

      <main className="admin-main-content">
        <h2 className="admin-title">Haber Yönetimi</h2>

        <div className="admin-news-form">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Başlık" />
          <textarea name="content" value={form.content} onChange={handleChange} placeholder="İçerik" rows={4} />
          <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="Görsel URL (opsiyonel)" />
          <select name="league_id" value={form.league_id} onChange={handleChange}>
            <option value="">Lig Seç (opsiyonel)</option>
            {leagues.map(league => (
              <option key={league.id} value={league.id}>{league.name}</option>
            ))}
          </select>
          <button onClick={handleSubmit}>{editingId ? 'Güncelle' : 'Ekle'}</button>
        </div>

        <div className="admin-news-list">
          {news.map(n => (
            <div key={n.id} className="admin-news-item">
              {n.image_url && <img src={n.image_url} alt="Haber görseli" className="admin-news-image" />}
              <div className="admin-news-content">
                <h4>{n.title}</h4>
                <p>{n.content}</p>
                {n.league_name && <span className="admin-league-badge">{n.league_name}</span>}
              </div>
              <div className="admin-news-actions">
                <button onClick={() => startEdit(n)}>Düzenle</button>
                <button onClick={() => deleteNews(n.id)}>Sil</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminNews;
