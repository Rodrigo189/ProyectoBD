import { useEffect, useState } from "react";
import { getFichaCompleta, updateFicha } from "../services/fichaService";
import Navbar from "../components/Navbar";
import FichaForm from "../components/FichaForm";
import "../assets/styles/globals.css";


export default function EditarFicha() {
  const [ficha, setFicha] = useState(null);
  const [rut, setRut] = useState("");

  const buscarFicha = async () => {
    try {
      const data = await getFichaCompleta(rut);
      setFicha(data.datos_sociales ? data.datos_sociales : null);
    } catch {
      alert("Ficha no encontrada");
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateFicha(rut, data);
      alert("Ficha actualizada correctamente.");
    } catch {
      alert("Error al actualizar la ficha.");
    }
  };

  return (
    <div>
      <Navbar titulo="Editar Ficha Clínica" />
      <div className="container">
        <h2>Buscar Ficha a Editar</h2>
        <div className="buscar">
          <input
            type="text"
            placeholder="Ingrese RUT del residente"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
          />
          <button onClick={buscarFicha}>Buscar</button>
        </div>

        {ficha && <FichaForm modo="editar" fichaInicial={ficha} onSubmit={handleUpdate} />}
      </div>
    </div>
  );
}
