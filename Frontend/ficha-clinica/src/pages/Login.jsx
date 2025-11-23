// src/pages/Login.jsx (Completo y Corregido)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../assets/styles/fichaClinica.module.css';
import api from '../services/api'; 

export default function Login() {
  const [rut, setRut] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    localStorage.removeItem('usuario'); // Siempre limpiar antes de intentar iniciar sesión

    try {
      // Aseguramos usar 'usuario' y 'password' como espera el backend
      const response = await api.post('/api/login', { usuario: rut, password: clave }); 
      
      const data = response.data;

      // Guardamos los datos del funcionario/usuario logueado
      localStorage.setItem('usuario', JSON.stringify(data.funcionario));
      alert('Login exitoso!');
      navigate('/menu'); // Redirigir al menú principal

    } catch (err) {
      localStorage.removeItem('usuario');
      // Usamos el mensaje de error del backend o uno por defecto
      setError(err.response?.data?.message || 'Credenciales inválidas o error de conexión.');
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
            placeholder="Ej: 11111111-1"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            required
          />
          <label htmlFor="clave" className={styles.label}>Contraseña</label>
          <input
            id="clave"
            type="password"
            className={styles.input}
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            required
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