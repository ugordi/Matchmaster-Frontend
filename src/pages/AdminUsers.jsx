import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminUsers.css';
import AdminSidebar from '../components/adminSidebar';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error('Kullanıcılar alınamadı:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDetails = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/users/${id}/details`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setDetails(res.data);
      setSelectedUser(id);
    } catch (err) {
      console.error('Detay alınamadı:', err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Bu kullanıcı silinsin mi?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchUsers();
      setSelectedUser(null);
      setDetails(null);
    } catch (err) {
      console.error('Silinemedi:', err);
    }
  };

  const banUser = async (id) => {
    if (!window.confirm('Bu kullanıcıya ait IPler banlansın mı?')) return;
    try {
      await axios.post(`http://localhost:5000/api/admin/users/${id}/ban`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      alert('IP adresleri banlandı');
    } catch (err) {
      console.error('Ban hatası:', err);
    }
  };

  const changeRole = async (id, role) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${id}/role`, { role }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      fetchUsers();
      if (selectedUser === id) {
        fetchDetails(id);
      }
    } catch (err) {
      console.error('Rol güncellenemedi:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />

      <main className="admin-main-content">
        <h2 className="admin-title">Kullanıcı Yönetimi</h2>

        <div style={{ display: 'flex', gap: '24px' }}>
          <div className="user-list">
            {loading ? (
              <p>Yükleniyor...</p>
            ) : (
              <ul>
                {users.map(user => (
                  <li
                    key={user.id}
                    onClick={() => fetchDetails(user.id)}
                    className={selectedUser === user.id ? 'selected' : ''}
                  >
                    {user.username} ({user.email})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="user-details">
            {details ? (
              <div>
                <h3>{details.user.username} Detayları</h3>
                <p><strong>Ad Soyad:</strong> {details.user.first_name} {details.user.last_name}</p>
                <p><strong>Email:</strong> {details.user.email}</p>
                <p><strong>Rol:</strong> {details.user.role}</p>
                <p><strong>Quiz Başarı:</strong> {details.quiz.correct}/{details.quiz.total} (%{details.quiz.successRate})</p>
                <p><strong>Tahmin Başarı:</strong> {details.prediction.correct}/{details.prediction.total} (%{details.prediction.successRate})</p>

                <h4>IP Adresleri</h4>
                <ul>
                  {details.ips.map((ip, index) => (
                    <li key={index}>
                      {ip.ip_address} ({new Date(ip.created_at).toLocaleString()})
                    </li>
                  ))}
                </ul>

                <div className="actions">
                  <button onClick={() => deleteUser(selectedUser)}>Kullanıcıyı Sil</button>
                  <button onClick={() => banUser(selectedUser)}>IP Banla</button>
                  <select
                    value={details.user.role}
                    onChange={(e) => changeRole(selectedUser, e.target.value)}
                  >
                    <option value="user">Kullanıcı</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            ) : (
              <p>Detay için bir kullanıcı seçin.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;
