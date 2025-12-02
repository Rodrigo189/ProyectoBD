import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../assets/styles/fichaClinica.module.css"; 
import ModalCustom from "../components/ModalCustom.jsx";

export default function BuscarFicha() {
  const [rutBusqueda, setRutBusqueda] = useState("");
  const navigate = useNavigate();

  const [modal, setModal] = useState({
    open: false,
    type: "info",
    title: "",
    msg: ""
  });

  // Formatea mientras escribe
  const handleRutChange = (e) => {
    let valor = e.target.value.replace(/[^0-9kK]/g, '');

    if (valor.length > 1) {
      const cuerpo = valor.slice(0, -1);
      const dv = valor.slice(-1).toUpperCase();
      valor = `${cuerpo}-${dv}`;
    }

    setRutBusqueda(valor);
  };

  const handleBuscar = async (e) => {
    e.preventDefault();

    let rut = rutBusqueda.trim().replace(/[^0-9kK]/g, '');

    if (!rut) {
      return setModal({
        open: true,
        type: "warning",
        title: "RUT vacío",
        msg: "Ingrese un RUT para continuar."
      });
    }

    if (rut.length < 2) {
      return setModal({
        open: true,
        type: "warning",
        title: "Formato incorrecto",
        msg: "El RUT ingresado es demasiado corto."
      });
    }

    // Asegurar guion
    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1).toUpperCase();
    const rutConGuion = `${cuerpo}-${dv}`;

    navigate(`/fichas/${rutConGuion}`);
  };

  return (
    <div>
      <ModalCustom
        isOpen={modal.open}
        onClose={() => setModal({ ...modal, open: false })}
        type={modal.type}
        title={modal.title}
        message={modal.msg}
      />

      <div className={styles.searchBox} style={{ marginTop: "100px" }}>
        <h2>Buscar Ficha Clínica</h2>

        <form className={styles.searchForm} onSubmit={handleBuscar}>
          <label htmlFor="rut" className={styles.label}>
            Ingrese el RUT del residente
          </label>

          <input
            id="rut"
            type="text"
            placeholder="Ej: 12345678-9"
            value={rutBusqueda}
            onChange={handleRutChange}
            className={styles.input}
            maxLength="12"
          />

          <button type="submit" className={styles.btnPrimary}>
            🔍 Buscar
          </button>
        </form>
      </div>
    </div>
  );
}
