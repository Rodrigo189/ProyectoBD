// src/pages/BuscarFicha.jsx (Completo y Corregido)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../assets/styles/fichaClinica.module.css"; 

export default function BuscarFicha() {
  const [rutBusqueda, setRutBusqueda] = useState("");
  const navigate = useNavigate();

  const handleBuscar = (e) => {
    e.preventDefault();
    // Limpia el RUT antes de navegar para tener una URL consistente
    const rutLimpio = rutBusqueda.trim().replace(/\./g, '').replace(/-/g, '').toUpperCase();

    if (!rutLimpio) {
      alert("⚠️ Ingrese un RUT válido para buscar la ficha clínica");
      return;
    }
    // Navegación usando el RUT limpio
    navigate(`/fichas/${rutLimpio}`);
  };

  return (
    <div>
      <div className={styles.searchBox} style={{marginTop: '100px'}}>
        <h2>Buscar Ficha Clínica</h2>
        <form className={styles.searchForm} onSubmit={handleBuscar}>
          <label htmlFor="rut" className={styles.label}>
            Ingrese el RUT del residente
          </label>
          <input
            id="rut"
            type="text"
            placeholder="Ej: 11111111-1"
            value={rutBusqueda}
            onChange={(e) => setRutBusqueda(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.btnPrimary}>
            🔍 Buscar
          </button>
        </form>
      </div>
    </div>
  );
}