// src/pages/NotFound.jsx (Completo y Corregido)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../assets/styles/fichaClinica.module.css"; 

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className={styles.pageContainer} style={{textAlign: 'center', marginTop: '100px'}}>
      <h2>Error 404</h2>
      <p>Página no encontrada.</p>
      <button 
          onClick={() => navigate("/")} 
          className={styles.btnSecondary} 
          style={{marginTop: '20px'}}
      >
        Volver al inicio
      </button>
    </div>
  );
}