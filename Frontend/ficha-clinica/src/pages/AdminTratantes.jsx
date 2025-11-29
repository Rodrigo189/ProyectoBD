// src/pages/AdminTratantes.jsx (COMPLETO)
import { useState, useEffect } from 'react';
import styles from '../assets/styles/fichaClinica.module.css';
import api from '../services/api'; 
import ModalCustom from "../components/ModalCustom.jsx"; // IMPORTADO

export default function AdminTratantes() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [rut, setRut] = useState('');
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState('');
  const [clave, setClave] = useState('');
  const [editando, setEditando] = useState(null);

  // === ESTADO DEL MODAL ===
  const [modal, setModal] = useState({ open: false, type: 'info', title: '', msg: '', onConfirm: null, confirmText: 'Aceptar' });

  const cargarFuncionarios = async () => {
    try {
      const res = await api.get('/api/funcionarios');
      setFuncionarios(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error al cargar funcionarios:', err);
      setModal({ open: true, type: 'error', title: 'Error', msg: 'Error al cargar la lista de tratantes.' });
    }
  };

  useEffect(() => {
    cargarFuncionarios();
  }, []);

  const limpiarFormulario = () => {
    setRut(''); setNombre(''); setRol(''); setClave(''); setEditando(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { rut_funcionario: rut, nombre, cargo: rol }; 
    
    if (editando) {
      if (clave) payload.password = clave;
    } else {
      if (!clave) {
        setModal({ open: true, type: 'warning', title: 'Falta Clave', msg: 'La clave es obligatoria para crear un nuevo tratante.' });
        return;
      }
      payload.password = clave;
    }
    
    try {
      if (editando) {
        await api.put(`/api/funcionarios/${editando}`, payload);
        setModal({ open: true, type: 'success', title: 'Actualizado', msg: 'Tratante actualizado correctamente.' });
      } else {
        await api.post('/api/funcionarios', payload);
        setModal({ open: true, type: 'success', title: 'Creado', msg: 'Nuevo tratante registrado exitosamente.' });
      }
      limpiarFormulario();
      await cargarFuncionarios();
    } catch (err) {
      setModal({ open: true, type: 'error', title: 'Error', msg: err.response?.data?.message || 'Error al guardar el tratante.' });
    }
  };

  const handleEditar = (func) => {
    const rutFunc = func.rut_funcionario || func.rut;
    const cargoFunc = func.cargo || func.rol;
    setEditando(rutFunc); setRut(rutFunc); setNombre(func.nombre); setRol(cargoFunc); setClave('');
  };

  const solicitarEliminar = (rutFunc) => {
    setModal({
        open: true,
        type: 'warning',
        title: '¿Eliminar Tratante?',
        msg: `¿Seguro que deseas eliminar al tratante RUT ${rutFunc}?`,
        confirmText: 'Sí, Eliminar',
        onConfirm: () => confirmarEliminacion(rutFunc)
    });
  };

  const confirmarEliminacion = async (rutFunc) => {
    try {
      await api.delete(`/api/funcionarios/${rutFunc}`);
      setModal({ open: true, type: 'success', title: 'Eliminado', msg: 'Tratante eliminado del sistema.' });
      if (editando === rutFunc) limpiarFormulario();
      await cargarFuncionarios();
    } catch (err) {
      setModal({ open: true, type: 'error', title: 'Error', msg: err.response?.data?.message || 'Error al eliminar el tratante.' });
    }
  };

  return (
    <div className={styles.pageContainer}>
      <ModalCustom isOpen={modal.open} onClose={() => setModal({ ...modal, open: false })} type={modal.type} title={modal.title} message={modal.msg} onConfirm={modal.onConfirm} confirmText={modal.confirmText} />

      <div className={styles.formSection}>
        <h3>{editando ? 'Editar Tratante' : 'Nuevo Tratante (Funcionario)'}</h3>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div><label className={styles.label}>RUT</label><input type="text" className={styles.input} value={rut} onChange={(e) => setRut(e.target.value)} readOnly={editando ? true : false} required placeholder='Ej: 11111111-1' /></div>
          <div><label className={styles.label}>Nombre Completo</label><input type="text" className={styles.input} value={nombre} onChange={(e) => setNombre(e.target.value)} required placeholder='Ej: Claudia Muñoz' /></div>
          <div><label className={styles.label}>Rol/Cargo</label><input type="text" className={styles.input} value={rol} onChange={(e) => setRol(e.target.value)} placeholder="Ej: Medico, Enfermera" required /></div>
          <div><label className={styles.label}>Clave (Contraseña)</label><input type="password" className={styles.input} value={clave} onChange={(e) => setClave(e.target.value)} placeholder={editando ? 'Dejar en blanco para no cambiar' : 'Requerida al crear'} required={!editando} /></div>
          <div className={styles.actionsContainer} style={{ gridColumn: '1 / -1', justifyContent: 'flex-start', marginTop: '10px' }}>
            <button type="submit" className={styles.btnPrimary}>{editando ? 'Actualizar' : 'Guardar'}</button>
            {editando && <button type="button" className={styles.btnSecondary} onClick={limpiarFormulario}>Cancelar Edición</button>}
          </div>
        </form>
      </div>

      <div className={styles.sectionBlock}>
        <h3>Lista de Tratantes</h3>
        <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '15px'}}>
          <thead><tr><th style={{padding: 8, border: '1px solid #ddd', background: '#f4f4f4'}}>RUT</th><th style={{padding: 8, border: '1px solid #ddd', background: '#f4f4f4'}}>Nombre</th><th style={{padding: 8, border: '1px solid #ddd', background: '#f4f4f4'}}>Rol</th><th style={{padding: 8, border: '1px solid #ddd', background: '#f4f4f4'}}>Acciones</th></tr></thead>
          <tbody>
            {funcionarios.length > 0 ? (
              funcionarios.map(func => (
                <tr key={func.rut_funcionario || func.rut}> 
                  <td style={{padding: 8, border: '1px solid #ddd'}}>{func.rut_funcionario || func.rut}</td>
                  <td style={{padding: 8, border: '1px solid #ddd'}}>{func.nombre}</td>
                  <td style={{padding: 8, border: '1px solid #ddd'}}>{func.cargo || func.rol}</td>
                  <td style={{padding: 8, border: '1px solid #ddd', display: 'flex', gap: 5, flexWrap: 'wrap'}}>
                    <button className={styles.btnFiltro} style={{backgroundColor: '#007bff'}} onClick={() => handleEditar(func)}>Editar</button>
                    <button className={styles.btnDanger} style={{padding: '5px 10px'}} onClick={() => solicitarEliminar(func.rut_funcionario || func.rut)}>Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" style={{padding: 8, border: '1px solid #ddd', textAlign: 'center', fontStyle: 'italic'}}>No hay tratantes registrados.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}