import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminSettings.css";
import AdminSidebar from "../components/adminSidebar";

const AdminSettings = () => {
  const [settings, setSettings] = useState({});
  const [editedSettings, setEditedSettings] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/settings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (res.data.success) {
        setSettings(res.data.settings);
        setEditedSettings(res.data.settings);
      }
    } catch (err) {
      console.error("Ayarlar getirilemedi:", err);
    }
  };

  const handleChange = (key, value) => {
    setEditedSettings((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async (key) => {
    try {
      await axios.put(
        "http://localhost:5000/api/admin/points",
        {
          setting: key,
          value: editedSettings[key]
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );
      setSuccessMessage(`${key} başarıyla güncellendi.`);
      setTimeout(() => setSuccessMessage(""), 2500);
    } catch (err) {
      console.error("Güncelleme hatası:", err);
    }
  };

  return (
    <div className="admin-settings-page">
      <AdminSidebar />
      <div className="admin-main-content">
        <h1 className="admin-title">⚙️ Sistem Ayarları</h1>

        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="settings-grid">
          {Object.entries(editedSettings).map(([key, value]) => (
            <div key={key} className="setting-item">
              <label>{key}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
              />
              <button onClick={() => handleSave(key)}>Kaydet</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
