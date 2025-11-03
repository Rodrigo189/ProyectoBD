import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFichaCompleta, deleteFicha } from "../services/fichaService";
import Navbar from "../components/Navbar";
import jsPDF from "jspdf";
import "jspdf-autotable";
import styles from "../assets/styles/fichaClinica.module.css";

export default function FichaClinica() {
  const { rut } = useParams();
  const navigate = useNavigate();

  const [ficha, setFicha] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rutBusqueda, setRutBusqueda] = useState("");

  // === HISTORIAL DE ATENCIONES ===
  const [filtroInicio, setFiltroInicio] = useState("");
  const [filtroFin, setFiltroFin] = useState("");
  const [historialFiltrado, setHistorialFiltrado] = useState([]);

  // === BUSCADOR PRINCIPAL ===
  const buscarFicha = (e) => {
    e.preventDefault();
    if (!rutBusqueda.trim()) {
      alert("⚠️ Ingrese un RUT para buscar la ficha clínica");
      return;
    }
    navigate(`/ficha/${rutBusqueda}`);
  };

  // === Cargar ficha si hay RUT en la URL ===
  useEffect(() => {
    if (!rut) {
      setLoading(false);
      return;
    }

    const fetchFicha = async () => {
      try {
        const data = await getFichaCompleta(rut);
        setFicha(data);

        if (data?.historia_clinica?.historial_atenciones) {
          setHistorialFiltrado(data.historia_clinica.historial_atenciones);
        } else {
          setHistorialFiltrado([]);
        }
      } catch (error) {
        console.error("Error al obtener la ficha:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFicha();
  }, [rut]);

  // === Aplicar filtro de historial ===
  const aplicarFiltro = () => {
    if (!filtroInicio || !filtroFin) {
      alert("Seleccione ambas fechas para filtrar.");
      return;
    }

    if (!ficha?.historia_clinica?.historial_atenciones) {
      alert("No hay historial disponible para filtrar.");
      return;
    }

    const inicio = new Date(filtroInicio);
    const fin = new Date(filtroFin);

    const filtrados = ficha.historia_clinica.historial_atenciones.filter((at) => {
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

  const eliminarFicha = async () => {
    if (!window.confirm("¿Seguro que deseas eliminar esta ficha clínica?")) return;
    try {
      await deleteFicha(ficha.rut_residente);
      alert("🗑️ Ficha eliminada correctamente");
      navigate("/");
    } catch (error) {
      console.error("Error al eliminar ficha:", error);
      alert("❌ No se pudo eliminar la ficha");
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text(`Ficha Clínica - ${ficha.datos_personales.nombre}`, 10, 10);
    doc.autoTable({
      startY: 20,
      head: [["Campo", "Valor"]],
      body: [
        ["RUT", ficha.rut_residente],
        ["Nombre", ficha.datos_personales.nombre],
        ["Edad", ficha.datos_personales.edad],
        ["Sexo", ficha.datos_personales.sexo],
        ["Peso", ficha.datos_personales.peso],
        ["Previsión Salud", ficha.datos_personales.prevision_salud],
        ["Previsión Social", ficha.datos_personales.prevision_social],
        ["Dirección", ficha.datos_personales.direccion_actual],
        ["Categoría Residente", ficha.historia_clinica.categoria_residente],
        ["Alergias", ficha.historia_clinica.alergias],
        ["Exámenes", ficha.historia_clinica.examenes],
        ["Medicamentos", ficha.historia_clinica.medicamentos_asociados],
      ],
    });
    doc.save(`Ficha_${ficha.datos_personales.nombre}.pdf`);
  };

  if (loading) return <p className={styles["loading-msg"]}>Cargando ficha...</p>;

  if (!rut) {
    return (
      <div>
        <Navbar titulo="Ficha Clínica ELEAM" />
        <div className={styles["buscador-inicio"]}>
          <h2>Buscar Ficha Clínica</h2>
          <form onSubmit={buscarFicha}>
            <input
              type="text"
              placeholder="Ej: 11111111-1"
              value={rutBusqueda}
              onChange={(e) => setRutBusqueda(e.target.value)}
            />
            <button type="submit">Buscar</button>
          </form>
        </div>
      </div>
    );
  }

  if (!ficha || ficha.message === "Ficha no encontrada")
    return <p className={styles["error-msg"]}>❌ No se encontró la ficha clínica solicitada.</p>;

  return (
    <div>
      <Navbar titulo="Ficha Clínica ELEAM" />

      <div className={styles["ficha-container"]}>
        <h2>Ficha Clínica del Residente</h2>

        <div className={styles["section-block"]}>
          <h3>Datos Personales</h3>
          <ul>
            <li><b>Nombre:</b> {ficha.datos_personales?.nombre}</li>
            <li><b>RUT:</b> {ficha.rut_residente}</li>
            <li><b>Fecha de nacimiento:</b> {ficha.datos_personales?.fecha_nacimiento}</li>
            <li><b>Edad:</b> {ficha.datos_personales?.edad}</li>
            <li><b>Sexo:</b> {ficha.datos_personales?.sexo}</li>
            <li><b>Peso:</b> {ficha.datos_personales?.peso} kg</li>
            <li><b>Previsión de salud:</b> {ficha.datos_personales?.prevision_salud}</li>
            <li><b>Previsión social:</b> {ficha.datos_personales?.prevision_social}</li>
            <li><b>Dirección actual:</b> {ficha.datos_personales?.direccion_actual}</li>
          </ul>
        </div>

        <div className={styles["section-block"]}>
          <h3>Ubicación e Ingreso</h3>
          <ul>
            <li><b>Habitación:</b> {ficha.ubicacion?.habitacion}</li>
            <li><b>Ingresa desde:</b> {ficha.ubicacion?.ingresa_desde}</li>
            <li><b>Motivo institucionalización:</b> {ficha.ubicacion?.motivo_institucionalizacion}</li>
          </ul>
        </div>

        <div className={styles["section-block"]}>
          <h3>Datos Sociales</h3>
          <ul>
            <li><b>Religión:</b> {ficha.datos_sociales?.religion}</li>
            <li><b>Actividad laboral previa:</b> {ficha.datos_sociales?.actividad_laboral_previa}</li>
            <li><b>Estado civil:</b> {ficha.datos_sociales?.estado_civil}</li>
            <li><b>Vive solo:</b> {ficha.datos_sociales?.vive_solo ? "Sí" : "No"}</li>
            <li><b>Calidad de apoyo:</b> {ficha.datos_sociales?.calidad_apoyo}</li>
          </ul>

          <h4>Escolaridad</h4>
          <ul>
            <li><b>Lectoescritura:</b> {ficha.datos_sociales?.escolaridad?.lectoescritura}</li>
            <li><b>Analfabeto:</b> {ficha.datos_sociales?.escolaridad?.analfabeto}</li>
            <li><b>Educación básica:</b> {ficha.datos_sociales?.escolaridad?.educacion_basica}</li>
            <li><b>Educación media:</b> {ficha.datos_sociales?.escolaridad?.educacion_media}</li>
            <li><b>Educación superior/técnica:</b> {ficha.datos_sociales?.escolaridad?.educacion_superior}</li>
          </ul>
        </div>

        <div className={styles["section-block"]}>
          <h3>Apoderado</h3>
          <ul>
            <li><b>Nombre:</b> {ficha.apoderado?.nombre}</li>
            <li><b>Parentesco:</b> {ficha.apoderado?.parentesco}</li>
            <li><b>Teléfono:</b> {ficha.apoderado?.telefono}</li>
            <li><b>Correo:</b> {ficha.apoderado?.correo}</li>
          </ul>
        </div>

        <div className={styles["section-block"]}>
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

        <div className={styles["section-block"]}>
          <h3>Historia Clínica</h3>
          <ul>
            <li><b>Categoría del residente:</b> {ficha.historia_clinica?.categoria_residente || "—"}</li>
            <li><b>Alergias / Contraindicaciones:</b> {ficha.historia_clinica?.alergias || "—"}</li>
            <li><b>Exámenes realizados:</b> {ficha.historia_clinica?.examenes || "—"}</li>
            <li><b>Medicamentos asociados al ingreso:</b> {ficha.historia_clinica?.medicamentos_asociados || "—"}</li>
          </ul>

          <h4>Historial de Atenciones y Motivos</h4>

          <div className={styles["historial-filtros"]}>
            <label>Desde:</label>
            <input type="date" value={filtroInicio} onChange={(e) => setFiltroInicio(e.target.value)} />
            <label>Hasta:</label>
            <input type="date" value={filtroFin} onChange={(e) => setFiltroFin(e.target.value)} />
            <button onClick={aplicarFiltro} className={styles["btn-filtro"]}>Filtrar</button>
            <button onClick={mostrarTodo} className={styles["btn-filtro-sec"]}>Mostrar todo</button>
          </div>

          <div className={styles["historial-lista"]}>
            {Array.isArray(historialFiltrado) && historialFiltrado.length > 0 ? (
              <ul>
                {historialFiltrado.map((at, i) => (
                  <li key={i}>
                    <b>{new Date(at.fecha).toLocaleDateString()}</b> — {at.motivo}
                    <br />
                    <span className={styles.detalle}>{at.detalle}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles["sin-atenciones"]}>No hay registros en el rango seleccionado.</p>
            )}
          </div>
        </div>

        <div className={styles["acciones-ficha"]}>
          <button className={styles["btn-accion"]} onClick={() => navigate(`/ficha/editar/${ficha.rut_residente}`)}>✏️ Editar</button>
          <button className={styles["btn-accion"]} onClick={eliminarFicha}>🗑️ Eliminar</button>
          <button className={styles["btn-accion"]} onClick={exportarPDF}>📄 Exportar PDF</button>
        </div>
      </div>
    </div>
  );
}
