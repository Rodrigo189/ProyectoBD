// src/pages/Login.jsx (Corregido)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../assets/styles/fichaClinica.module.css';
import api from '../services/api'; // Importamos tu api.js

export default function Login() {
  const [rut, setRut] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // --- LOGIN REAL ---
      // Apuntamos a tu backend (api.js ya sabe que es :5001)
      const response = await api.post('/api/login', { rut, clave });
      
      const data = response.data;

      // Guardamos los datos del usuario en localStorage
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      alert('Login exitoso!');
      navigate('/fichas'); // Redirigir al buscador de fichas

    } catch (err) {
      // Si el login falla (401) o el servidor está caído
      localStorage.removeItem('usuario');
      setError(err.response?.data?.message || 'No se pudo conectar al servidor.');
    }
  };

  return (
    <div>
      <div className={styles.searchBox} style={{marginTop: '100px'}}>
        <h2>Acceso Tratantes</h2>
        <p>Módulo de Fichas Clínicas</p>
        <form className={styles.searchForm} onSubmit={handleLogin}>
          <label htmlFor="rut" className={styles.label}>RUT (Tratante)</label>
          <input
            id="rut"
            type="text"
            className={styles.input}
            placeholder="Ej: 11.111.111-1"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
          />
          <label htmlFor="clave" className={styles.label}>Contraseña</label>
          <input
            id="clave"
            type="password"
            className={styles.input}
            value={clave}
            onChange={(e) => setClave(e.target.value)}
          />
          {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
          <button type="submit" className={styles.btnPrimary}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}