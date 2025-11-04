// src/pages/FichaClinica.jsx
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFichaCompleta, deleteFicha } from "../services/fichaService";
import Navbar from "../components/Navbar";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import styles from "../assets/styles/fichaClinica.module.css";

export default function FichaClinica() { 
  const { rut } = useParams();
  const navigate = useNavigate();

  const [ficha, setFicha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rutBusqueda, setRutBusqueda] = useState("");

  const [filtroInicio, setFiltroInicio] = useState("");
  const [filtroFin, setFiltroFin] = useState("");
  const [historialFiltrado, setHistorialFiltrado] = useState([]);
  
  const componenteParaImprimirRef = useRef(null);

  // === BUSCADOR (en la misma página) ===
  const buscarFicha = (e) => {
    e.preventDefault();
    if (!rutBusqueda.trim()) {
      alert("⚠️ Ingrese un RUT para buscar la ficha clínica");
      return;
    }
    navigate(`/ficha/${rutBusqueda}`);
  };

  // === Cargar ficha ===
  useEffect(() => {
    if (!rut) {
      setLoading(false);
      return;
    }
    const fetchFicha = async () => {
      try {
        setLoading(true); 
        const data = await getFichaCompleta(rut);
        setFicha(data);
        if (data?.historia_clinica?.historial_atenciones) {
          setHistorialFiltrado(data.historia_clinica.historial_atenciones);
        } else {
          setHistorialFiltrado([]);
        }
      } catch (error) {
        console.error("Error al obtener la ficha:", error);
        setFicha(null); 
      } finally {
        setLoading(false);
      }
    };
    fetchFicha();
  }, [rut]); 

  // === Filtros de historial ===
  const aplicarFiltro = () => {
    if (!filtroInicio || !filtroFin) {
      alert("Seleccione ambas fechas para filtrar.");
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

  // === Eliminar Ficha ===
  const eliminarFicha = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar esta ficha clínica?")) return;
    try {
      await deleteFicha(ficha.rut_residente || ficha.datos_personales.rut);
      alert("🗑️ Ficha eliminada correctamente");
      navigate("/");
    } catch (error) {
      console.error("Error al eliminar ficha:", error);
      alert("❌ No se pudo eliminar la ficha");
    }
  };

  // === EXPORTAR PDF (con html2canvas) ===
  const exportarPDF = () => {
    const input = componenteParaImprimirRef.current;
    if (!input) {
      console.error("No se encontró el elemento para imprimir");
      return;
    }

    // Ocultar temporalmente los filtros antes de tomar la captura
    const filtros = input.querySelector(`.${styles.historialFiltros}`);
    if (filtros) filtros.style.display = 'none';

    html2canvas(input, {
      scale: 2, // Mejora la resolución de la imagen
      useCORS: true // Para que cargue imágenes si las hubiera
    }).then(canvas => {
      // Volver a mostrar los filtros
      if (filtros) filtros.style.display = 'flex'; // 'flex' o 'block'

      const imgData = canvas.toDataURL('image/png');
      
      // Dimensiones del PDF (A4) y de la imagen
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calcular la relación de aspecto
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2; // Centrar la imagen
      const imgY = 10; // Margen superior
      const imgFinalHeight = imgHeight * ratio;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgFinalHeight);
      
      // Manejar contenido que excede una página (opcional simple)
      let heightLeft = imgFinalHeight;
      heightLeft -= pdfHeight;

      let position = imgY + imgFinalHeight; // Posición inicial para la siguiente página

      while (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', imgX, -position, imgWidth * ratio, imgFinalHeight);
        heightLeft -= pdfHeight;
        position += imgFinalHeight - pdfHeight;
      }
      
      pdf.save(`Ficha-Residente-${ficha.datos_personales.rut}.pdf`);
    }).catch(err => {
      // En caso de error, asegurarse de mostrar los filtros
      if (filtros) filtros.style.display = 'flex';
      console.error("Error al generar el PDF:", err);
      alert("❌ No se pudo generar el PDF.");
    });
  };

  // === Vistas de Carga / Buscador ===
  if (loading) return (
    <div>
      <Navbar titulo="Ficha Clínica ELEAM" />
      <p className={styles.loadingMsg}>Cargando ficha...</p>
    </div>
  );

  if (!rut) {
    return (
      <div>
        <Navbar titulo="Ficha Clínica ELEAM" />
        <div className={styles.searchBox}>
          <h2>Buscar Ficha Clínica</h2>
          <form className={styles.searchForm} onSubmit={buscarFicha}>
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

  if (!ficha || ficha.message === "Ficha no encontrada")
    return (
      <div>
        <Navbar titulo="Ficha Clínica ELEAM" />
        <p className={styles.errorMsg}>❌ No se encontró la ficha clínica para el RUT: {rut}.</p>
        <div className={styles.searchBox}>
          <form className={styles.searchForm} onSubmit={buscarFicha}>
            <input
              type="text"
              placeholder="Ej: 11111111-1"
              value={rutBusqueda}
              onChange={(e) => setRutBusqueda(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.btnPrimary}>Buscar Otro RUT</button>
          </form>
        </div>
      </div>
    );

  // === VISTA DE LA FICHA COMPLETA ===
  return (
    <div>
      <Navbar titulo="Ficha Clínica ELEAM" />
      
      {/* Contenedor de la ficha que se imprimirá */}
      <div className={styles.pageContainer} ref={componenteParaImprimirRef}>
        
        {/* Título solo para impresión */}
        <div className={styles.printTitle}>
          <h1>Ficha Clínica Integral</h1>
          <h2>Residente: {ficha.datos_personales?.nombre}</h2>
          <h3>RUT: {ficha.rut_residente || ficha.datos_personales.rut}</h3>
        </div>

        <h2>Ficha Clínica del Residente</h2>

        {/* --- RESTO DEL JSX (Actualizado a CSS Modules) --- */}
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

      {/* --- BOTONES MOVIDOS AL FINAL (CON ETIQUETAS CORREGIDAS) --- */}
      <div className={styles.actionsContainer}>
        <button className={styles.btnPrimary} onClick={() => navigate(`/ficha/editar/${ficha.rut_residente || ficha.datos_personales.rut}`)}>✏️ Editar</button>
        <button className={styles.btnDanger} onClick={eliminarFicha}>🗑️ Eliminar</button>
        <button className={styles.btnPdf} onClick={exportarPDF}>📄 Exportar PDF</button>
      </div>
      
    </div>
  );
}