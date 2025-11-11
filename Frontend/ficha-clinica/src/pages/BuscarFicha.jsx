// src/pages/BuscarFicha.jsx (Corregido)
import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar"; // ELIMINADO
import styles from "../assets/styles/fichaClinica.module.css"; 

export default function BuscarFicha() {
  const [rutBusqueda, setRutBusqueda] = useState("");
  const navigate = useNavigate();

  const handleBuscar = (e) => {
    e.preventDefault();
    if (!rutBusqueda.trim()) {
      alert("⚠️ Ingrese un RUT para buscar la ficha clínica");
      return;
    }
    navigate(`/fichas/${rutBusqueda}`);
  };

  return (
    <div>
      {/* <Navbar titulo="Ficha Clínica ELEAM" /> ELIMINADO */}

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
          />
          <button type="submit" className={styles.btnPrimary}>
            🔍 Buscar
          </button>
        </form>
      </div>
    </div>
  );
}