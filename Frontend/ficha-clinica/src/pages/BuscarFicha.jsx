import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../assets/styles/fichaClinica.module.css"; 
import ModalCustom from "../components/ModalCustom.jsx"; // Importamos el Modal personalizado

export default function BuscarFicha() {
  const [rutBusqueda, setRutBusqueda] = useState("");
  const navigate = useNavigate();

  // === ESTADO DEL MODAL (Para reemplazar los alerts) ===
  const [modal, setModal] = useState({ 
    open: false, 
    type: 'info', 
    title: '', 
    msg: '' 
  });

  // Función para formatear el RUT mientras escribes (agrega guion automáticamente)
  const handleRutChange = (e) => {
    // 1. Limpiar caracteres inválidos
    let valor = e.target.value.replace(/[^0-9kK]/g, '');
    
    // 2. Formatear visualmente (12345678-9)
    if (valor.length > 1) {
      const cuerpo = valor.slice(0, -1);
      const dv = valor.slice(-1);
      valor = `${cuerpo}-${dv}`;
    }
    
    setRutBusqueda(valor);
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    
    // Limpiamos espacios y pasamos a mayúsculas
    const rutParaUrl = rutBusqueda.trim().toUpperCase();

    // VALIDACIÓN 1: Campo vacío
    if (!rutParaUrl) {
      setModal({
        open: true,
        type: 'warning',
        title: 'Campo Vacío',
        msg: 'Por favor, ingrese un RUT para realizar la búsqueda.'
      });
      return;
    }
    
    // VALIDACIÓN 2: RUT muy corto
    if (rutParaUrl.length < 3) {
      setModal({
        open: true,
        type: 'warning',
        title: 'RUT Incompleto',
        msg: 'El RUT ingresado parece demasiado corto. Verifique el formato.'
      });
      return;
    }
    
    // Si pasa las validaciones, navegamos
    navigate(`/fichas/${rutParaUrl}`);
  };

  return (
    <div>
      {/* Componente Modal para mostrar mensajes sin usar alert() */}
      <ModalCustom 
        isOpen={modal.open}
        onClose={() => setModal({...modal, open: false})}
        type={modal.type}
        title={modal.title}
        message={modal.msg}
      />

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