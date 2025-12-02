// src/pages/FichaClinica.jsx (CORREGIDO: Exportación en UNA SOLA HOJA)
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom"; 
import { getFichaCompleta, deleteFicha } from "../services/fichaService";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import styles from "../assets/styles/fichaClinica.module.css";
import ModalCustom from "../components/ModalCustom.jsx"; 

// === Helpers para adaptar el JSON real de Mongo al formato que usa la vista ===
function calcularEdad(fechaStr) {
  if (!fechaStr) return null;
  const hoy = new Date();
  const fechaNac = new Date(fechaStr);
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const m = hoy.getMonth() - fechaNac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
    edad--;
  }
  return edad;
}

function normalizarFicha(doc) {
  // Si ya viene con datos_personales, asumimos que ya está normalizada
  if (doc.datos_personales) return doc;

  const fc = doc.ficha_clinica || {};
  const datosSociales = fc.datos_sociales || {};
  const antecedentes = fc.antecedentes_medicos || {};
  const ubicacion = fc.ubicacion || {};
  const historia = fc.historia_clinica || {};

  const edad = calcularEdad(doc.fecha_nacimiento);

  return {
    // por compatibilidad con tu vista
    rut_residente: doc.rut,
    datos_personales: {
      rut: doc.rut,
      nombre: doc.nombre,
      fecha_nacimiento: doc.fecha_nacimiento,
      edad: edad,
      sexo: doc.sexo,
      peso: doc.peso ?? "",                // no viene en el JSON, lo dejamos vacío
      prevision_salud: doc.prevision_salud,
      prevision_social: doc.prevision_social ?? "",
      direccion_actual: doc.direccion ?? "",
    },
    ubicacion: {
      habitacion: ubicacion.habitacion ?? "",
      ingresa_desde: ubicacion.ingresa_desde ?? "",
      motivo_institucionalizacion: ubicacion.motivo_institucionalizacion ?? "",
    },
    datos_sociales: {
      religion: datosSociales.religion ?? "",
      actividad_laboral_previa: datosSociales.actividad_laboral_previa ?? "",
      estado_civil: datosSociales.estado_civil ?? "",
      vive_solo: !!datosSociales.vive_solo,
      calidad_apoyo: datosSociales.calidad_apoyo ?? "",
      escolaridad: {
        lectoescritura: datosSociales.escolaridad?.lectoescritura ?? "",
        analfabeto: datosSociales.escolaridad?.analfabeto ?? "",
        educacion_basica: datosSociales.escolaridad?.educacion_basica ?? "",
        educacion_media: datosSociales.escolaridad?.educacion_media ?? "",
        educacion_superior: datosSociales.escolaridad?.educacion_superior ?? "",
      },
    },
    apoderado: doc.apoderado || {},
    antecedentes_medicos: {
      artrosis: !!antecedentes.artrosis,
      cancer: antecedentes.cancer ?? "",
      diabetes_tipo_I: !!antecedentes.diabetes_tipo_I,
      diabetes_tipo_II: !!antecedentes.diabetes_tipo_II,
      glaucoma: !!antecedentes.glaucoma,
      epoc: !!antecedentes.epoc,
      patologia_renal: !!antecedentes.patologia_renal,
      otras_patologias: antecedentes.otras_patologias ?? "",
      detalle_patologia_renal: antecedentes.detalle_patologia_renal ?? "",
    },
    historia_clinica: {
      categoria_residente: historia.categoria_residente ?? "",
      alergias: historia.alergias ?? "",
      examenes: historia.examenes ?? "",
      medicamentos_asociados: historia.medicamentos_asociados ?? "",
      historial_atenciones: Array.isArray(historia.historial_atenciones)
        ? historia.historial_atenciones
        : [],
    },
  };
}

export default function FichaClinica() { 
  const { rut } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); 
  const [ficha, setFicha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rutBusqueda, setRutBusqueda] = useState("");
  const [filtroInicio, setFiltroInicio] = useState("");
  const [filtroFin, setFiltroFin] = useState("");
  const [historialFiltrado, setHistorialFiltrado] = useState([]);
  
  // Referencia al contenedor que vamos a fotografiar
  const componenteParaImprimirRef = useRef(null);

  const [modal, setModal] = useState({ open: false, type: 'info', title: '', msg: '', onConfirm: null, confirmText: 'Aceptar' });

  const handleRutChange = (e) => {
    const input = e.target.value;
    let rutLimpio = input.replace(/[^0-9kK-]/g, '');
    const partes = rutLimpio.split('-');
    if (partes.length > 2) {
      rutLimpio = partes[0] + '-' + partes.slice(1).join('');
    }
    if (rutLimpio.includes('-') && rutLimpio.indexOf('-') !== rutLimpio.length - 2) {
      const digitos = rutLimpio.replace(/[^0-9kK]/g, '');
      const digitoVerificador = rutLimpio.replace(/[^kK]/g, '');
      rutLimpio = digitos.slice(0, -1) + '-' + digitos.slice(-1) + digitoVerificador;
    }
    setRutBusqueda(rutLimpio);
  };

  const buscarFicha = (e) => {
    e.preventDefault();
    if (!rutBusqueda.trim()) {
      setModal({ open: true, type: 'warning', title: 'Atención', msg: 'Ingrese un RUT válido para buscar la ficha.' });
      return;
    }
    const rutLimpio = rutBusqueda.trim().replace(/-/g, '').toUpperCase();
    const soloDigitos = rutLimpio.replace(/[^0-9]/g, '');
    if (soloDigitos.length < 7) {
      setModal({ open: true, type: 'warning', title: 'Atención', msg: 'El RUT debe tener al menos 7 dígitos.' });
      return;
    }
    navigate(`/fichas/${rutLimpio}`, { state: { rutBuscado: rutLimpio } });
  };

  useEffect(() => {
  if (location.state?.rutNotFound) {
      setLoading(false);
      return;
  }

  if (!rut) {
    setLoading(false);
    return;
  }
  
  const fetchFicha = async () => {
    try {
      setLoading(true); 
      const dataCruda = await getFichaCompleta(rut);

      if (!dataCruda || dataCruda.message === "Ficha no encontrada") {
           navigate(location.pathname, { replace: true, state: { rutNotFound: true, rutBuscado: rut } });
           return; 
      }

      // AQUI normalizamos el JSON que viene de Mongo
      const data = normalizarFicha(dataCruda);
      
      if (location.state?.rutNotFound) {
           navigate(location.pathname, { replace: true, state: null });
      }
      
      setFicha(data);
      if (data?.historia_clinica?.historial_atenciones) {
        setHistorialFiltrado(data.historia_clinica.historial_atenciones);
      } else {
        setHistorialFiltrado([]);
      }
    } catch (error) {
      console.error("Error al obtener la ficha:", error);
      navigate(location.pathname, { replace: true, state: { rutNotFound: true, rutBuscado: rut } });
      setFicha(null); 
    } finally {
      if (!location.state?.rutNotFound) {
           setLoading(false);
      }
    }
  };
  fetchFicha(); 
}, [rut, navigate, location.pathname]);


  const aplicarFiltro = () => {
    if (!filtroInicio || !filtroFin) {
      setModal({ open: true, type: 'info', title: 'Filtros', msg: 'Seleccione ambas fechas para filtrar.' });
      return;
    }
    const inicio = new Date(filtroInicio + "T00:00:00");
    const fin = new Date(filtroFin + "T23:59:59");
    const filtrados = ficha.historia_clinica.historial_atenciones.filter((at) => {
      if (!at.fecha) return false;
      const fechaAt = new Date(at.fecha);
      return fechaAt >= inicio && fechaAt <= fin;
    });
    setHistorialFiltrado(filtrados);
  };

  const mostrarTodo = () => {
    if (ficha?.historia_clinica?.historial_atenciones) {
      setHistorialFiltrado(ficha.historia_clinica.historial_atenciones);
    } else {
      setHistorialFiltrado([]);
    }
    setFiltroInicio("");
    setFiltroFin("");
  };

  const solicitarEliminarFicha = () => {
    setModal({
        open: true,
        type: 'warning',
        title: '¿Eliminar Ficha Completa?',
        msg: 'ADVERTENCIA: Se eliminará permanentemente la ficha y TODOS sus historiales médicos. Esta acción es irreversible.',
        confirmText: 'Estoy seguro, Eliminar',
        onConfirm: ejecutarEliminacion
    });
  };

  const ejecutarEliminacion = async () => {
    try {
      await deleteFicha(ficha.rut_residente || ficha.datos_personales.rut);
      setModal({
        open: true,
        type: 'success',
        title: 'Eliminada',
        msg: 'La ficha ha sido eliminada del sistema.',
        onConfirm: () => navigate("/fichas"),
        confirmText: 'Volver al Buscador'
      });
    } catch (error) {
      console.error("Error al eliminar ficha:", error);
      setModal({ open: true, type: 'error', title: 'Error', msg: 'No se pudo eliminar la ficha.' });
    }
  };

  // === NUEVA FUNCIÓN DE EXPORTACIÓN A PDF (1 SOLA HOJA) ===
  const exportarPDF = () => {
    const input = componenteParaImprimirRef.current;
    if (!input) return;

    // 1. Añadimos clase para modo compacto
    input.classList.add(styles.pdfMode);

    html2canvas(input, { scale: 2, useCORS: true })
      .then(canvas => {
        // 2. Quitamos la clase inmediatamente después de la foto
        input.classList.remove(styles.pdfMode);

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Dimensiones hoja A4 en mm
        const pdfWidth = 210; 
        const pdfHeight = 297; 

        // Dimensiones de la imagen capturada
        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = imgProps.width;
        const imgHeight = imgProps.height;

        // Calculamos el ratio para ajustar al ancho
        const ratioWidth = pdfWidth / imgWidth;
        // Calculamos el ratio para ajustar al alto
        const ratioHeight = pdfHeight / imgHeight;

        // ELEGIMOS EL RATIO MÁS PEQUEÑO para que quepa ENTERA (ancho y alto)
        // Esto fuerza a que sea UNA sola hoja
        let ratio = Math.min(ratioWidth, ratioHeight);

        // Calculamos dimensiones finales
        const finalWidth = imgWidth * ratio;
        const finalHeight = imgHeight * ratio;

        // Centramos horizontalmente si sobra espacio
        const xOffset = (pdfWidth - finalWidth) / 2;
        
        // Agregamos la imagen ajustada
        pdf.addImage(imgData, 'PNG', xOffset, 10, finalWidth, finalHeight); // 10mm de margen superior
        
        pdf.save(`Ficha-${ficha.datos_personales.rut}.pdf`);
      })
      .catch(err => {
        input.classList.remove(styles.pdfMode); // Asegurar quitar clase si falla
        console.error("Error al generar el PDF:", err);
        setModal({ open: true, type: 'error', title: 'Error PDF', msg: 'No se pudo generar el PDF.' });
      });
  };

  if (loading) return <div><p className={styles.loadingMsg}>Cargando ficha...</p></div>;

  if (!ficha)
    return (
      <div>
        <p className={styles.errorMsg}>❌ No se encontró la ficha clínica para el RUT: {rut}.</p>
        <div className={styles.searchBox}>
          <form className={styles.searchForm} onSubmit={buscarFicha}>
            <input type="text" placeholder="Ej: 11111111-1" value={rutBusqueda} onChange={handleRutChange} className={styles.input} pattern="[0-9kK-]+" title="Formato: números, guión y la letra K para el dígito verificador" maxLength="12" />
            <button type="submit" className={styles.btnPrimary}>Buscar Otro RUT</button>
          </form>
        </div>
      </div>
    );

  return (
    <div>
      <ModalCustom isOpen={modal.open} onClose={() => setModal({...modal, open: false})} type={modal.type} title={modal.title} message={modal.msg} onConfirm={modal.onConfirm} confirmText={modal.confirmText} />

      <div className={styles.pageContainer} ref={componenteParaImprimirRef}>
        <div className={styles.printTitle}>
          <h1>Ficha Clínica Integral</h1>
          <h2>Residente: {ficha.datos_personales?.nombre}</h2>
          <h3>RUT: {ficha.rut_residente || ficha.datos_personales.rut}</h3>
        </div>

        {/* Solo mostramos el H2 si NO estamos en modo PDF (manejado por CSS styles.pdfMode si quieres ocultarlo también, pero lo dejamos por ahora) */}
        <h2>Ficha Clínica del Residente</h2>
        
        <div className={styles.sectionBlock}>
          <h3>Datos Personales</h3>
          <ul>
            <li><b>Nombre:</b> {ficha.datos_personales?.nombre || "—"}</li>
            <li><b>RUT:</b> {ficha.rut_residente || ficha.datos_personales?.rut || "—"}</li>
            <li><b>Fecha de nacimiento:</b> {ficha.datos_personales?.fecha_nacimiento ? new Date(ficha.datos_personales.fecha_nacimiento).toLocaleDateString('es-CL') : "—"}</li>
            <li><b>Edad:</b> {ficha.datos_personales?.edad || "—"} años</li>
            <li><b>Sexo:</b> {ficha.datos_personales?.sexo || "—"}</li>
            <li><b>Peso:</b> {ficha.datos_personales?.peso || "—"} kg</li>
            <li><b>Previsión de salud:</b> {ficha.datos_personales?.prevision_salud || "—"}</li>
            <li><b>Previsión social:</b> {ficha.datos_personales?.prevision_social || "—"}</li>
            <li><b>Dirección actual:</b> {ficha.datos_personales?.direccion_actual || "—"}</li>
          </ul>
        </div>
        <div className={styles.sectionBlock}>
          <h3>Ubicación e Ingreso</h3>
          <ul>
            <li><b>Habitación:</b> {ficha.ubicacion?.habitacion || "—"}</li>
            <li><b>Ingresa desde:</b> {ficha.ubicacion?.ingresa_desde || "—"}</li>
            <li><b>Motivo institucionalización:</b> {ficha.ubicacion?.motivo_institucionalizacion || "—"}</li>
          </ul>
        </div>
        <div className={styles.sectionBlock}>
          <h3>Datos Sociales</h3>
          <ul>
            <li><b>Religión:</b> {ficha.datos_sociales?.religion || "—"}</li>
            <li><b>Actividad laboral previa:</b> {ficha.datos_sociales?.actividad_laboral_previa || "—"}</li>
            <li><b>Estado civil:</b> {ficha.datos_sociales?.estado_civil || "—"}</li>
            <li><b>Vive solo:</b> {ficha.datos_sociales?.vive_solo ? "Sí" : "No"}</li>
            <li><b>Calidad de apoyo:</b> {ficha.datos_sociales?.calidad_apoyo || "—"}</li>
          </ul>
          <h4>Escolaridad</h4>
          <ul>
            <li><b>Lectoescritura:</b> {ficha.datos_sociales?.escolaridad?.lectoescritura || "—"}</li>
            <li><b>Analfabeto:</b> {ficha.datos_sociales?.escolaridad?.analfabeto || "—"}</li>
            <li><b>Educación básica:</b> {ficha.datos_sociales?.escolaridad?.educacion_basica || "—"}</li>
            <li><b>Educación media:</b> {ficha.datos_sociales?.escolaridad?.educacion_media || "—"}</li>
            <li><b>Educación superior/técnica:</b> {ficha.datos_sociales?.escolaridad?.educacion_superior || "—"}</li>
          </ul>
        </div>
        <div className={styles.sectionBlock}>
          <h3>Apoderado</h3>
          <ul>
            <li><b>Nombre:</b> {ficha.apoderado?.nombre || "—"}</li>
            <li><b>Parentesco:</b> {ficha.apoderado?.parentesco || "—"}</li>
            <li><b>Teléfono:</b> {ficha.apoderado?.telefono || "—"}</li>
            <li><b>Correo:</b> {ficha.apoderado?.correo || "—"}</li>
          </ul>
        </div>
        <div className={styles.sectionBlock}>
          <h3>Antecedentes Médicos</h3>
          <ul>
            <li><b>Artrosis:</b> {ficha.antecedentes_medicos?.artrosis ? "Sí" : "No"}</li>
            <li><b>Cáncer (tipo/etapa):</b> {ficha.antecedentes_medicos?.cancer || "—"}</li>
            <li><b>Diabetes tipo I:</b> {ficha.antecedentes_medicos?.diabetes_tipo_I ? "Sí" : "No"}</li>
            <li><b>Diabetes tipo II:</b> {ficha.antecedentes_medicos?.diabetes_tipo_II ? "Sí" : "No"}</li>
            <li><b>Glaucoma:</b> {ficha.antecedentes_medicos?.glaucoma ? "Sí" : "No"}</li>
            <li><b>EPOC:</b> {ficha.antecedentes_medicos?.epoc ? "Sí" : "No"}</li>
            <li><b>Patología renal:</b> {ficha.antecedentes_medicos?.patologia_renal ? "Sí" : "No"}</li>
            <li><b>Otras patologías:</b> {ficha.antecedentes_medicos?.otras_patologias || "—"}</li>
          </ul>
        </div>
        <div className={styles.sectionBlock}>
          <h3>Historia Clínica</h3>
          <ul>
            <li><b>Categoría del residente:</b> {ficha.historia_clinica?.categoria_residente || "—"}</li>
            <li><b>Alergias / Contraindicaciones:</b> {ficha.historia_clinica?.alergias || "—"}</li>
            <li><b>Exámenes realizados:</b> {ficha.historia_clinica?.examenes || "—"}</li>
            <li><b>Medicamentos asociados al ingreso:</b> {ficha.historia_clinica?.medicamentos_asociados || "—"}</li>
          </ul>
          <h4>Historial de Atenciones y Motivos</h4>
          <div className={styles.historialFiltros}>
            <label>Desde:</label>
            <input type="date" value={filtroInicio} onChange={(e) => setFiltroInicio(e.target.value)} />
            <label>Hasta:</label>
            <input type="date" value={filtroFin} onChange={(e) => setFiltroFin(e.target.value)} />
            <button onClick={aplicarFiltro} className={styles.btnFiltro}>Filtrar</button>
            <button onClick={mostrarTodo} className={styles.btnFiltroSec}>Mostrar todo</button>
          </div>
          <div className={styles.historialLista}>
            {Array.isArray(historialFiltrado) && historialFiltrado.length > 0 ? (
              <ul>
                {historialFiltrado.map((at, i) => (
                  <li key={i}>
                    <b>{at.fecha ? new Date(at.fecha).toLocaleDateString('es-CL') : 'Fecha no reg.'}</b> ({at.hora || 'S/H'}) — {at.motivo}
                    <br />
                    <span className={styles.detalle}><b>Tratante:</b> {at.tratante || 'N/A'}</span>
                    <br />
                    <span className={styles.detalle}><b>Medicamentos:</b> {at.medicamentos || 'N/A'}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.sinAtenciones}>No hay registros en el rango seleccionado.</p>
            )}
          </div>
        </div>
      </div>

      <div className={styles.actionsContainer}>
        <button className={styles.btnPrimary} onClick={() => navigate(`/fichas/${ficha.rut_residente || ficha.datos_personales.rut}/editar`)}>✏️ Editar</button>
        <button className={styles.btnDanger} onClick={solicitarEliminarFicha}>🗑️ Eliminar</button>
        <button className={styles.btnPdf} onClick={exportarPDF}>📄 Exportar PDF (1 Hoja)</button>
      </div>
      
    </div>
  );
}