import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { useToast } from "./Toast";
import Modal from "./Modal";
import "../styles/riesgos.css";

// Detectar automáticamente si estamos en producción (Render)
const isProduction = window.location.hostname !== "localhost";
const API_BASE = isProduction
    ? "https://eleam-grupo14-backend.onrender.com"
    : "http://localhost:5000";

// Iconos para cada categoría de riesgo
const CATEGORY_ICONS = {
    caidas: "🚶",
    ulceras: "🛏️",
    nutricion: "🍽️",
    cognitivo: "🧠",
    polifarmacia: "💊"
};

const CATEGORY_NAMES = {
    caidas: "Riesgo de Caídas",
    ulceras: "Úlceras por Presión",
    nutricion: "Estado Nutricional",
    cognitivo: "Estado Cognitivo",
    polifarmacia: "Polifarmacia"
};

const CATEGORY_SCALES = {
    caidas: "Escala de Downton",
    ulceras: "Escala de Norton",
    nutricion: "Mini Nutritional Assessment",
    cognitivo: "Mini Mental State",
    polifarmacia: "Nº Medicamentos"
};

const levelClass = (nivel) => {
    const n = String(nivel || "").toLowerCase();
    if (n.includes("alto") || n.includes("critico")) return "alto";
    if (n.includes("medio")) return "medio";
    return "bajo";
};

const prioridadClass = (prioridad) => {
    const p = String(prioridad || "").toLowerCase();
    if (p.includes("critica")) return "critica";
    if (p.includes("alta")) return "alta";
    return "media";
};

export default function RiesgosPage() {
    const navigate = useNavigate();
    const { showToast, ToastComponent } = useToast();

    const [residentes, setResidentes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedResidente, setSelectedResidente] = useState(null);
    const [filtroNivel, setFiltroNivel] = useState("todos");
    const [busqueda, setBusqueda] = useState("");
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [categoriaDetalle, setCategoriaDetalle] = useState(null);

    // Cargar datos de riesgos
    useEffect(() => {
        const fetchRiesgos = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/riesgos-residentes`);
                if (res.ok) {
                    const data = await res.json();
                    setResidentes(data);
                    if (data.length > 0) {
                        setSelectedResidente(data[0]);
                    }
                }
            } catch (error) {
                console.error("Error cargando riesgos:", error);
                showToast("Error al cargar datos de riesgos", "error");
            } finally {
                setLoading(false);
            }
        };
        fetchRiesgos();
    }, []);

    // Calcular resumen general
    const calcularResumen = () => {
        let criticos = 0, altos = 0, alertasTotal = 0;
        residentes.forEach(r => {
            Object.values(r.evaluaciones || {}).forEach(ev => {
                if (ev.nivel === "Alto") altos++;
            });
            alertasTotal += (r.alertas_activas || []).filter(a =>
                a.prioridad === "critica" || a.prioridad === "alta"
            ).length;
            if ((r.alertas_activas || []).some(a => a.prioridad === "critica")) {
                criticos++;
            }
        });
        return { criticos, altos, alertasTotal };
    };

    const resumen = calcularResumen();

    // Filtrar residentes
    const residentesFiltrados = residentes.filter(r => {
        const matchBusqueda = r.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            r.habitacion.toLowerCase().includes(busqueda.toLowerCase());

        if (filtroNivel === "todos") return matchBusqueda;

        const tieneNivel = Object.values(r.evaluaciones || {}).some(ev =>
            ev.nivel.toLowerCase() === filtroNivel
        );
        return matchBusqueda && tieneNivel;
    });

    // Abrir detalle de categoría
    const abrirDetalle = (categoria) => {
        setCategoriaDetalle(categoria);
        setShowDetalleModal(true);
    };

    // Obtener nivel general del residente
    const getNivelGeneral = (residente) => {
        const niveles = Object.values(residente.evaluaciones || {}).map(e => e.nivel);
        if (niveles.includes("Alto")) return "Alto";
        if (niveles.includes("Medio")) return "Medio";
        return "Bajo";
    };

    return (
        <div className="riesgos-bg">
            <Header onBack={() => navigate(-1)} />
            <ToastComponent />

            <main className="riesgos-main">
                <div className="riesgos-header">
                    <h1>🏥 Evaluación de Riesgos de Residentes</h1>
                    <p className="riesgos-subtitle">Sistema de monitoreo clínico - Red ELEAM</p>
                </div>

                {/* Panel de Resumen */}
                <section className="resumen-panel">
                    <div className="resumen-card critico">
                        <span className="resumen-numero">{resumen.criticos}</span>
                        <span className="resumen-label">Residentes Críticos</span>
                    </div>
                    <div className="resumen-card alto">
                        <span className="resumen-numero">{resumen.altos}</span>
                        <span className="resumen-label">Riesgos Altos</span>
                    </div>
                    <div className="resumen-card alertas">
                        <span className="resumen-numero">{resumen.alertasTotal}</span>
                        <span className="resumen-label">Alertas Activas</span>
                    </div>
                    <div className="resumen-card total">
                        <span className="resumen-numero">{residentes.length}</span>
                        <span className="resumen-label">Total Residentes</span>
                    </div>
                </section>

                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Cargando evaluaciones...</p>
                    </div>
                ) : (
                    <div className="riesgos-content">
                        {/* Lista de Residentes */}
                        <aside className="residentes-sidebar">
                            <div className="sidebar-header">
                                <h2>Residentes</h2>
                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    className="busqueda-input"
                                />
                                <select
                                    value={filtroNivel}
                                    onChange={(e) => setFiltroNivel(e.target.value)}
                                    className="filtro-select"
                                >
                                    <option value="todos">Todos los niveles</option>
                                    <option value="alto">🔴 Riesgo Alto</option>
                                    <option value="medio">🟡 Riesgo Medio</option>
                                    <option value="bajo">🟢 Riesgo Bajo</option>
                                </select>
                            </div>

                            <div className="residentes-list">
                                {residentesFiltrados.map(r => (
                                    <div
                                        key={r.rut}
                                        className={`residente-item ${selectedResidente?.rut === r.rut ? "selected" : ""} ${levelClass(getNivelGeneral(r))}`}
                                        onClick={() => setSelectedResidente(r)}
                                    >
                                        <div className="residente-info">
                                            <span className="residente-nombre">{r.nombre}</span>
                                            <span className="residente-hab">Hab. {r.habitacion}</span>
                                        </div>
                                        <div className="residente-badges">
                                            {(r.alertas_activas || []).length > 0 && (
                                                <span className="badge-alertas">
                                                    ⚠️ {r.alertas_activas.length}
                                                </span>
                                            )}
                                            <span className={`nivel-badge ${levelClass(getNivelGeneral(r))}`}>
                                                {getNivelGeneral(r)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </aside>

                        {/* Detalle del Residente */}
                        {selectedResidente && (
                            <section className="residente-detalle">
                                {/* Cabecera del residente */}
                                <div className="detalle-header">
                                    <div className="residente-avatar">
                                        {selectedResidente.nombre.charAt(0)}
                                    </div>
                                    <div className="residente-datos">
                                        <h2>{selectedResidente.nombre}</h2>
                                        <p>
                                            <span>📍 Habitación {selectedResidente.habitacion}</span>
                                            <span>🎂 {selectedResidente.edad} años</span>
                                            <span>🆔 {selectedResidente.rut}</span>
                                        </p>
                                    </div>
                                    <div className={`nivel-general ${levelClass(getNivelGeneral(selectedResidente))}`}>
                                        Riesgo {getNivelGeneral(selectedResidente)}
                                    </div>
                                </div>

                                {/* Alertas activas */}
                                {(selectedResidente.alertas_activas || []).length > 0 && (
                                    <div className="alertas-section">
                                        <h3>⚠️ Alertas Activas</h3>
                                        <div className="alertas-grid">
                                            {selectedResidente.alertas_activas.map(alerta => (
                                                <div key={alerta.id} className={`alerta-card ${prioridadClass(alerta.prioridad)}`}>
                                                    <span className="alerta-icon">{CATEGORY_ICONS[alerta.tipo]}</span>
                                                    <div className="alerta-content">
                                                        <span className="alerta-mensaje">{alerta.mensaje}</span>
                                                        <span className="alerta-fecha">{alerta.fecha}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Evaluaciones por categoría */}
                                <div className="evaluaciones-section">
                                    <h3>📋 Evaluaciones de Riesgo</h3>
                                    <div className="evaluaciones-grid">
                                        {Object.entries(selectedResidente.evaluaciones || {}).map(([key, eval_data]) => (
                                            <div
                                                key={key}
                                                className={`evaluacion-card ${levelClass(eval_data.nivel)}`}
                                                onClick={() => abrirDetalle(key)}
                                            >
                                                <div className="eval-header">
                                                    <span className="eval-icon">{CATEGORY_ICONS[key]}</span>
                                                    <span className="eval-name">{CATEGORY_NAMES[key]}</span>
                                                </div>
                                                <div className="eval-body">
                                                    <div className="eval-score">
                                                        <span className="score-value">
                                                            {key === "polifarmacia" ? eval_data.cantidad_medicamentos : eval_data.puntaje}
                                                        </span>
                                                        <span className="score-scale">{CATEGORY_SCALES[key]}</span>
                                                    </div>
                                                    <span className={`eval-nivel ${levelClass(eval_data.nivel)}`}>
                                                        {eval_data.nivel}
                                                    </span>
                                                </div>
                                                <div className="eval-footer">
                                                    <span>📅 {eval_data.ultima_evaluacion}</span>
                                                    <span className="ver-detalle">Ver detalle →</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Historial de incidentes */}
                                {(selectedResidente.historial_incidentes || []).length > 0 && (
                                    <div className="historial-section">
                                        <h3>📜 Historial de Incidentes</h3>
                                        <div className="historial-timeline">
                                            {selectedResidente.historial_incidentes.map((inc, idx) => (
                                                <div key={idx} className="historial-item">
                                                    <div className="historial-fecha">{inc.fecha}</div>
                                                    <div className="historial-content">
                                                        <span className="historial-tipo">{inc.tipo}</span>
                                                        <p className="historial-desc">{inc.descripcion}</p>
                                                        <p className="historial-acciones">
                                                            <strong>Acciones:</strong> {inc.acciones}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}
                    </div>
                )}
            </main>

            {/* Modal de detalle de evaluación */}
            <Modal
                isOpen={showDetalleModal}
                onClose={() => setShowDetalleModal(false)}
                title={`${CATEGORY_ICONS[categoriaDetalle]} ${CATEGORY_NAMES[categoriaDetalle] || ""}`}
                size="md"
            >
                {selectedResidente && categoriaDetalle && selectedResidente.evaluaciones[categoriaDetalle] && (
                    <div className="modal-evaluacion-detalle">
                        <div className="detalle-info-grid">
                            <div className="detalle-info-item">
                                <label>Puntaje</label>
                                <span className="info-value">
                                    {categoriaDetalle === "polifarmacia"
                                        ? selectedResidente.evaluaciones[categoriaDetalle].cantidad_medicamentos + " medicamentos"
                                        : selectedResidente.evaluaciones[categoriaDetalle].puntaje + " pts"
                                    }
                                </span>
                            </div>
                            <div className="detalle-info-item">
                                <label>Nivel de Riesgo</label>
                                <span className={`info-nivel ${levelClass(selectedResidente.evaluaciones[categoriaDetalle].nivel)}`}>
                                    {selectedResidente.evaluaciones[categoriaDetalle].nivel}
                                </span>
                            </div>
                            <div className="detalle-info-item">
                                <label>Última Evaluación</label>
                                <span>{selectedResidente.evaluaciones[categoriaDetalle].ultima_evaluacion}</span>
                            </div>
                            <div className="detalle-info-item">
                                <label>Próxima Evaluación</label>
                                <span>{selectedResidente.evaluaciones[categoriaDetalle].proxima_evaluacion}</span>
                            </div>
                        </div>

                        <div className="detalle-factores">
                            <h4>Factores de Riesgo Identificados</h4>
                            <ul>
                                {(selectedResidente.evaluaciones[categoriaDetalle].factores || []).map((f, i) => (
                                    <li key={i}>{f}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="modal-actions">
                            <button
                                className="btn-actualizar"
                                onClick={() => {
                                    showToast("Función de actualización en desarrollo", "info");
                                }}
                            >
                                📝 Actualizar Evaluación
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}