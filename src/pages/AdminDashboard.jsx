import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import AdminSidebar from '../components/adminSidebar';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/dashboard-stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error('İstatistik alınamadı:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar />
      
      <main className="admin-main-content">
        <h1 className="admin-title">📊 Yönetim Paneli</h1>

        {loading ? (
          <div className="admin-loading">İstatistikler yükleniyor...</div>
        ) : stats ? (
          <div className="admin-stats-grid">
            {Object.entries(stats).map(([key, value]) => (
              <div key={key} className="admin-stat-card">
                <div className="admin-stat-label">
                  {key.replace(/_/g, ' ')}
                </div>
                <div className="admin-stat-value">{value}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="admin-error">İstatistik verileri alınamadı.</div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
