import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../assets/styles/fichaForm.css";

export default function BuscarFicha() {
  const [rutBusqueda, setRutBusqueda] = useState("");
  const navigate = useNavigate();

  const handleBuscar = (e) => {
    e.preventDefault();
    if (!rutBusqueda.trim()) {
      alert("⚠️ Ingrese un RUT para buscar la ficha clínica");
      return;
    }
    navigate(`/ficha/${rutBusqueda}`);
  };

  return (
    <div>
      <Navbar titulo="Ficha Clínica ELEAM" />

      <div className="buscar-container">
        <h2>Buscar Ficha Clínica</h2>

        <form className="buscar-form" onSubmit={handleBuscar}>
          <label htmlFor="rut" className="label-required">
            Ingrese el RUT del residente
          </label>
          <input
            id="rut"
            type="text"
            placeholder="Ej: 11111111-1"
            value={rutBusqueda}
            onChange={(e) => setRutBusqueda(e.target.value)}
          />

          <button type="submit" className="btn-crear">
            🔍 Buscar
          </button>
        </form>
      </div>
    </div>
  );
}
