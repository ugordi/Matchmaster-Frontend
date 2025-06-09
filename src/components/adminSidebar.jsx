import React from 'react';
import './adminSidebar.css';

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="admin-sidebar-header" onClick={() => window.location.href = '/admin'}>
        Admin Panel
      </div>
      <div className="admin-sidebar-nav">
        <button className="admin-sidebar-item" onClick={() => window.location.href = '/admin/users'}>Kullanıcılar</button>
        <button className="admin-sidebar-item" onClick={() => window.location.href = '/admin/quiz'}>Quizler</button>
        <button className="admin-sidebar-item" onClick={() => window.location.href = '/admin/news'}>Haberler</button>
        <button className="admin-sidebar-item" onClick={() => window.location.href = '/admin/settings'}>Ayarlar</button>
        <button className="admin-sidebar-item" onClick={() => window.location.href = '/admin/matches'}>Maçlar</button>
        <button className="admin-sidebar-item" onClick={() => window.location.href = '/admin/leagues'}>Ligler</button>
        <button className="admin-sidebar-item" onClick={() => window.location.href = '/admin/teams'}>Takımlar</button>
        <hr className="admin-sidebar-divider" />
        <button className="admin-sidebar-item homepage-button" onClick={() => window.location.href = '/'}>🏠 Ana Sayfa</button>
      </div>
    </div>
  );
};

export default AdminSidebar;
