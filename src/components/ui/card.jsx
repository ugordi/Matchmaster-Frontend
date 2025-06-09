import React from 'react';

export const Card = ({ children }) => (
  <div className="bg-white rounded-xl shadow-md">{children}</div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
