import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Breadcrumb.css';

function Breadcrumb({ items }) {
  const navigate = useNavigate();

  const handleClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <nav className="breadcrumb">
      {items.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {item.path ? (
            <span 
              className="breadcrumb-link" 
              onClick={() => handleClick(item.path)}
            >
              {item.label}
            </span>
          ) : (
            <span className="breadcrumb-current">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span className="breadcrumb-separator"> › </span>
          )}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumb;