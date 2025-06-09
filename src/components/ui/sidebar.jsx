import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Sidebar = ({ items }) => {
  const navigate = useNavigate();

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
      {items.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className="text-left py-2 px-3 rounded hover:bg-gray-700"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};


