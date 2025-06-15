import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/adminSidebar";
import "./AdminSystemPredictions.css";

const AdminSystemPred = () => {
  const [systemPredictions, setSystemPredictions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchPredictions = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/system-predictions?page=${pageNumber}&limit=10`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setSystemPredictions(res.data.system_predictions);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Sistem tahminleri alınamadı:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPredictions(page);
    // eslint-disable-next-line
  }, [page]);

  const handlePageClick = (pageNum) => {
    if (pageNum !== page) setPage(pageNum);
  };

  return (
    <div className="admin-system-page">
      <AdminSidebar />
      <main className="admin-system-content">
        <h2 className="admin-system-title">⚡ Sistem Tahminleri</h2>
        <div className="admin-system-table-wrapper">
          {loading ? (
            <div className="admin-system-loading">Yükleniyor...</div>
          ) : (
            <table className="admin-system-table">
              <thead>
                <tr>
                  <th>Hafta</th>
                  <th>Maç</th>
                  <th>Tarih</th>
                  <th>Ev Sahibi Oran (%)</th>
                  <th>Beraberlik Oran (%)</th>
                  <th>Deplasman Oran (%)</th>
                </tr>
              </thead>
              <tbody>
                {systemPredictions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="admin-system-nodata">Veri yok.</td>
                  </tr>
                ) : (
                  systemPredictions.map((row) => (
                    <tr key={row.id}>
                      <td>{row.match_week}</td>
                      <td>
                        {row.home_team} vs {row.away_team}
                      </td>
                      <td>
                        {new Date(row.match_date).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "2-digit" })}
                      </td>
                      <td>%{Number(row.home_win_probability).toFixed(1)}</td>
                      <td>%{Number(row.draw_probability).toFixed(1)}</td>
                      <td>%{Number(row.away_win_probability).toFixed(1)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        <div className="admin-system-pagination">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`admin-system-pagination-btn${page === i + 1 ? " active" : ""}`}
              onClick={() => handlePageClick(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminSystemPred;
