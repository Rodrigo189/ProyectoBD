import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import Calendario from "./Calendar";
import {
    fetchFuncionarioById,
    fetchResumenByUserMonth,
    fetchSisByRut,
    updateSistema,
} from "./funcionariosApi";

export default function FuncionarioDashboard({
    forceId = null,
    showFuncionariosButton = false,
    onShowFuncionarios = null,
}) {
    const params = useParams();
    const routeId = params?.id || null;
    const id = forceId || routeId;
    const currentUserId = window.localStorage.getItem("currentUserId") || null;
    const currentUserRole = window.localStorage.getItem("currentUserRole") || null;
    const navId = id || currentUserId || null;

    // Determinar si el usuario actual es admin y está viendo a OTRO usuario
    const isAdmin = currentUserRole === "admin";
    const isViewingOther = id && id !== currentUserId;
    const canEdit = isAdmin && isViewingOther;

    const shouldShowFuncionarios = !!showFuncionariosButton && !id;
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("resumen");
    const [menuOpen, setMenuOpen] = useState(false);
    const [month, setMonth] = useState(null);
    const [resumen, setResumen] = useState(null);
    const [resumenLoading, setResumenLoading] = useState(false);
    const [historial, setHistorial] = useState([]);
    const [histLoading, setHistLoading] = useState(false);
    const [sisData, setSisData] = useState(null);

    // Estados para edición
    const [editingResumen, setEditingResumen] = useState(false);
    const [editedResumen, setEditedResumen] = useState({});
    const [saving, setSaving] = useState(false);

    // Modal para agregar turno desde calendario
    const [showTurnoModal, setShowTurnoModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [nuevoTurno, setNuevoTurno] = useState({
        turno: "Mañana",
        horaInicio: "08:00",
        horaFin: "16:00",
        observaciones: ""
    });

    // Modal para agregar registro en historial
    const [showHistorialModal, setShowHistorialModal] = useState(false);
    const [nuevoRegistro, setNuevoRegistro] = useState({
        fecha: "",
        turno: "Mañana",
        horaInicio: "08:00",
        horaFin: "16:00",
        horas: 8,
        observaciones: ""
    });

    // Cargar datos base del usuario
    useEffect(() => {
        let mounted = true;
        (async () => {
            setLoading(true);
            setData(null);
            const targetId = id || currentUserId;
            if (!targetId) {
                setLoading(false);
                return;
            }
            const f = await fetchFuncionarioById(targetId);
            if (!mounted) return;
            setData(f);
            const todayMonth = new Date().getMonth() + 1;
            const available = f?.resumen ? Object.keys(f.resumen).map((k) => Number(k)) : [];
            const initialMonth = available.includes(todayMonth) ? todayMonth : (available[0] || todayMonth);
            setMonth(initialMonth);
            setLoading(false);
        })();
        return () => { mounted = false; };
    }, [id, currentUserId]);

    // Cargar resumen mensual
    useEffect(() => {
        let mounted = true;
        if (!data || !data.id || month == null) {
            setResumen(null);
            return;
        }
        setResumenLoading(true);
        (async () => {
            const r = await fetchResumenByUserMonth(data.id, month);
            if (!mounted) return;
            setResumen(r);
            setEditedResumen(r || {});
            setResumenLoading(false);
        })();
        return () => { mounted = false; };
    }, [data, month]);

    // Cargar historial y SIS completo
    useEffect(() => {
        let mounted = true;
        if (!data || !data.id) {
            setHistorial([]);
            setSisData(null);
            return;
        }
        setHistLoading(true);
        (async () => {
            try {
                const sis = await fetchSisByRut(data.id);
                if (!mounted) return;
                setSisData(sis);
                setHistorial(Array.isArray(sis?.registros) ? sis.registros : []);
            } finally {
                if (mounted) setHistLoading(false);
            }
        })();
        return () => { mounted = false; };
    }, [data]);

    // Guardar resumen editado
    const handleSaveResumen = async () => {
        if (!canEdit || !data?.id) return;
        setSaving(true);
        try {
            const updatedSis = {
                ...sisData,
                horas: editedResumen.horas || 0,
                extra: editedResumen.turnosExtra || 0,
            };
            await updateSistema(data.id, updatedSis);
            setResumen(editedResumen);
            setEditingResumen(false);
            alert("Resumen guardado correctamente");
        } catch (e) {
            alert("Error al guardar: " + (e.error || e.message || "Error desconocido"));
        } finally {
            setSaving(false);
        }
    };

    // Obtener día de la semana en español
    const getDiaSemana = (fechaStr) => {
        const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const fecha = new Date(fechaStr + "T12:00:00");
        return dias[fecha.getDay()];
    };

    // Agregar turno desde calendario
    const handleAddTurno = async () => {
        if (!canEdit || !data?.id || !selectedDate) return;
        setSaving(true);
        try {
            const nuevoReg = {
                fecha: selectedDate,
                dia: getDiaSemana(selectedDate),
                turno: nuevoTurno.turno,
                horario: `${nuevoTurno.horaInicio}–${nuevoTurno.horaFin}`,
                horas: calcularHoras(nuevoTurno.horaInicio, nuevoTurno.horaFin),
                observaciones: nuevoTurno.observaciones
            };
            const registrosActualizados = [...(sisData?.registros || []), nuevoReg];
            const updatedSis = { ...sisData, registros: registrosActualizados };
            await updateSistema(data.id, updatedSis);
            setSisData(updatedSis);
            setHistorial(registrosActualizados);
            setShowTurnoModal(false);
            setNuevoTurno({ turno: "Mañana", horaInicio: "08:00", horaFin: "16:00", observaciones: "" });
            alert("Turno agregado correctamente");
        } catch (e) {
            alert("Error al agregar turno: " + (e.error || e.message || "Error desconocido"));
        } finally {
            setSaving(false);
        }
    };

    // Agregar registro desde historial
    const handleAddRegistro = async () => {
        if (!canEdit || !data?.id || !nuevoRegistro.fecha) return;
        setSaving(true);
        try {
            const nuevoReg = {
                fecha: nuevoRegistro.fecha,
                dia: getDiaSemana(nuevoRegistro.fecha),
                turno: nuevoRegistro.turno,
                horario: `${nuevoRegistro.horaInicio}–${nuevoRegistro.horaFin}`,
                horas: nuevoRegistro.horas,
                observaciones: nuevoRegistro.observaciones
            };
            const registrosActualizados = [...(sisData?.registros || []), nuevoReg];
            const updatedSis = { ...sisData, registros: registrosActualizados };
            await updateSistema(data.id, updatedSis);
            setSisData(updatedSis);
            setHistorial(registrosActualizados);
            setShowHistorialModal(false);
            setNuevoRegistro({ fecha: "", turno: "Mañana", horaInicio: "08:00", horaFin: "16:00", horas: 8, observaciones: "" });
            alert("Registro agregado correctamente");
        } catch (e) {
            alert("Error al agregar registro: " + (e.error || e.message || "Error desconocido"));
        } finally {
            setSaving(false);
        }
    };

    // Calcular horas entre dos horarios
    const calcularHoras = (inicio, fin) => {
        const [h1, m1] = inicio.split(":").map(Number);
        const [h2, m2] = fin.split(":").map(Number);
        let diff = (h2 * 60 + m2) - (h1 * 60 + m1);
        if (diff < 0) diff += 24 * 60; // turno nocturno
        return Math.round(diff / 60);
    };

    // Click en día del calendario
    const handleDayClick = (dateIso, entriesForDay) => {
        if (canEdit) {
            setSelectedDate(dateIso);
            setShowTurnoModal(true);
        }
    };

    if (loading) {
        return (
            <div className="perfil-bg">
                <Header onBack={() => navigate(-1)} />
                <main className="perfil-main">
                    <div className="perfil-frame">Cargando...</div>
                </main>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="perfil-bg">
                <Header onBack={() => navigate(-1)} />
                <main className="perfil-main">
                    <div className="perfil-frame">Funcionario no encontrado</div>
                </main>
            </div>
        );
    }

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const availableMonths = data?.resumen ? Object.keys(data.resumen).map((k) => Number(k)).sort((a, b) => a - b) : [];

    const handleVerFuncionariosClick = () => {
        if (typeof onShowFuncionarios === "function") return onShowFuncionarios();
        navigate("/ListaFuncionarioRyE");
    };

    return (
        <div className="perfil-bg">
            <Header onBack={() => navigate(-1)} />
            <main className="perfil-main">
                <div className="perfil-frame">
                    {/* Info del funcionario */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                        <section className="perfil-card" style={{ flex: 1 }}>
                            <div className="perfil-left">
                                <div className="perfil-avatar" aria-hidden="true">
                                    <img src={data.avatar} alt="Perfil" className="perfil-conf" />
                                </div>
                                <div className="perfil-details">
                                    <p><span className="label">Nombre(s):</span> {data.nombre}</p>
                                    <p><span className="label">Apellido(s):</span> {data.apellido}</p>
                                    <p><span className="label">RUN:</span> {data.rut || data.run}</p>
                                    <p><span className="label">Género:</span> {data.genero}</p>
                                    <p><span className="label">Cargo:</span> {data.cargo}</p>
                                </div>
                            </div>
                            <div className="perfil-right">
                                <p><span className="label">Dirección:</span> {data.direccion}</p>
                                <p><span className="label">Email:</span> {data.email}</p>
                                <p><span className="label">Teléfono:</span> {data.telefono}</p>
                                <p><span className="label">Fecha de nacimiento:</span> {data.nacimiento ?? "-"}</p>
                            </div>
                        </section>
                    </div>

                    {/* Tabs */}
                    <div className="menu-row">
                        <div className="menu-left">
                            <div className={`tab-menu ${menuOpen ? "open" : ""}`}>
                                <button className={`tab-btn ${activeTab === "resumen" ? "active" : ""}`} onClick={() => { setActiveTab("resumen"); setMenuOpen(false); }}>Resumen</button>
                                <button className={`tab-btn ${activeTab === "calendario" ? "active" : ""}`} onClick={() => { setActiveTab("calendario"); setMenuOpen(false); }}>Calendario</button>
                                <button className={`tab-btn ${activeTab === "historial" ? "active" : ""}`} onClick={() => { setActiveTab("historial"); setMenuOpen(false); }}>Historial</button>
                            </div>
                        </div>
                        <div className="menu-right">
                            <button className="estad-link-btn" onClick={() => navigate(navId ? `/Estadisticas/${navId}` : `/Estadisticas`)}>Ver Estadísticas</button>
                            {shouldShowFuncionarios && (
                                <button className="estad-link-btn" style={{ marginLeft: 10 }} onClick={handleVerFuncionariosClick}>Ver Funcionarios</button>
                            )}
                        </div>
                    </div>

                    {/* Contenido de tabs */}
                    <section style={{ marginTop: 14 }}>
                        {/* RESUMEN */}
                        {activeTab === "resumen" && (
                            <div className="resumen-panel">
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <strong>Mes:</strong>
                                        <select className="month-select" value={month ?? ""} onChange={(e) => setMonth(Number(e.target.value))}>
                                            {monthNames.map((mn, i) => {
                                                const m = i + 1;
                                                const disabled = availableMonths.length > 0 && !availableMonths.includes(m);
                                                return <option key={m} value={m} disabled={disabled}>{mn}</option>;
                                            })}
                                        </select>
                                    </div>
                                    {canEdit && !editingResumen && (
                                        <button className="estad-link-btn" onClick={() => setEditingResumen(true)}>Editar</button>
                                    )}
                                    {canEdit && editingResumen && (
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <button className="estad-link-btn" onClick={handleSaveResumen} disabled={saving}>
                                                {saving ? "Guardando..." : "Guardar"}
                                            </button>
                                            <button className="tab-btn" onClick={() => { setEditingResumen(false); setEditedResumen(resumen || {}); }}>Cancelar</button>
                                        </div>
                                    )}
                                </div>

                                {resumenLoading ? (
                                    <p>Cargando resumen...</p>
                                ) : editingResumen ? (
                                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                        {[
                                            { key: "diasTrabajados", label: "Días trabajados" },
                                            { key: "horas", label: "Horas trabajadas" },
                                            { key: "turnosExtra", label: "Turnos extra" },
                                            { key: "turnosLargos", label: "Turnos largos" },
                                            { key: "turnosNoche", label: "Turnos noche" },
                                            { key: "diasLibre", label: "Días libre" },
                                        ].map(({ key, label }) => (
                                            <div key={key} className="summary-card" style={{ cursor: "default" }}>
                                                <input
                                                    type="number"
                                                    value={editedResumen[key] ?? 0}
                                                    onChange={(e) => setEditedResumen({ ...editedResumen, [key]: Number(e.target.value) })}
                                                    style={{ width: 60, fontSize: 18, fontWeight: "bold", textAlign: "center", border: "1px solid #ccc", borderRadius: 4 }}
                                                />
                                                <div>{label}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : resumen && Object.values(resumen).some((v) => v !== 0) ? (
                                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                        <div className="summary-card"><strong>{resumen?.diasTrabajados ?? 0}</strong><div>Días trabajados</div></div>
                                        <div className="summary-card"><strong>{resumen?.horas ?? 0}</strong><div>Horas trabajadas</div></div>
                                        <div className="summary-card"><strong>{resumen?.turnosExtra ?? 0}</strong><div>Turnos extra</div></div>
                                        <div className="summary-card"><strong>{resumen?.turnosLargos ?? 0}</strong><div>Turnos largos</div></div>
                                        <div className="summary-card"><strong>{resumen?.turnosNoche ?? 0}</strong><div>Turnos noche</div></div>
                                        <div className="summary-card"><strong>{resumen?.diasLibre ?? 0}</strong><div>Días libre</div></div>
                                    </div>
                                ) : (
                                    <p>No hay datos para {monthNames[(month || 1) - 1]}.</p>
                                )}
                            </div>
                        )}

                        {/* CALENDARIO */}
                        {activeTab === "calendario" && (
                            <div className="calendario-panel">
                                {canEdit && <p style={{ color: "#008f8f", marginBottom: 8 }}>💡 Haz clic en un día para agregar un turno</p>}
                                <Calendario
                                    year={new Date().getFullYear()}
                                    month={month || new Date().getMonth() + 1}
                                    entries={historial}
                                    firstDayMonday={true}
                                    onDayClick={handleDayClick}
                                    onMonthChange={(m) => setMonth(m)}
                                    onYearChange={() => { }}
                                />
                            </div>
                        )}

                        {/* HISTORIAL */}
                        {activeTab === "historial" && (
                            <div className="historial-panel">
                                {canEdit && (
                                    <div style={{ marginBottom: 12 }}>
                                        <button className="estad-link-btn" onClick={() => setShowHistorialModal(true)}>+ Agregar Registro</button>
                                    </div>
                                )}
                                {histLoading ? (
                                    <p>Cargando historial...</p>
                                ) : (
                                    <table className="historial-table">
                                        <thead>
                                            <tr><th>Fecha</th><th>Día</th><th>Turno</th><th>Horario</th><th>Horas</th><th>Observaciones</th></tr>
                                        </thead>
                                        <tbody>
                                            {historial.length === 0 ? (
                                                <tr><td colSpan={6} style={{ textAlign: "center" }}>Sin registros</td></tr>
                                            ) : (
                                                historial.map((h, i) => (
                                                    <tr key={i}>
                                                        <td>{h.fecha}</td>
                                                        <td>{h.dia}</td>
                                                        <td>{h.turno}</td>
                                                        <td>{h.horario}</td>
                                                        <td>{h.horas}</td>
                                                        <td>{h.observaciones}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {/* Modal para agregar turno desde calendario */}
            {showTurnoModal && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                    <div style={{ background: "white", padding: 24, borderRadius: 12, minWidth: 320 }}>
                        <h3 style={{ marginTop: 0 }}>Agregar Turno - {selectedDate}</h3>
                        <div style={{ marginBottom: 12 }}>
                            <label>Turno:</label>
                            <select value={nuevoTurno.turno} onChange={(e) => setNuevoTurno({ ...nuevoTurno, turno: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 4 }}>
                                <option value="Mañana">Mañana</option>
                                <option value="Tarde">Tarde</option>
                                <option value="Noche">Noche</option>
                                <option value="Largo">Largo</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: 12, display: "flex", gap: 12 }}>
                            <div style={{ flex: 1 }}>
                                <label>Hora inicio:</label>
                                <input type="time" value={nuevoTurno.horaInicio} onChange={(e) => setNuevoTurno({ ...nuevoTurno, horaInicio: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 4 }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label>Hora fin:</label>
                                <input type="time" value={nuevoTurno.horaFin} onChange={(e) => setNuevoTurno({ ...nuevoTurno, horaFin: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 4 }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <label>Observaciones:</label>
                            <textarea value={nuevoTurno.observaciones} onChange={(e) => setNuevoTurno({ ...nuevoTurno, observaciones: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 4, minHeight: 60 }} />
                        </div>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <button className="tab-btn" onClick={() => setShowTurnoModal(false)}>Cancelar</button>
                            <button className="estad-link-btn" onClick={handleAddTurno} disabled={saving}>{saving ? "Guardando..." : "Guardar"}</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal para agregar registro en historial */}
            {showHistorialModal && (
                <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
                    <div style={{ background: "white", padding: 24, borderRadius: 12, minWidth: 320 }}>
                        <h3 style={{ marginTop: 0 }}>Agregar Registro</h3>
                        <div style={{ marginBottom: 12 }}>
                            <label>Fecha:</label>
                            <input type="date" value={nuevoRegistro.fecha} onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, fecha: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 4 }} />
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <label>Turno:</label>
                            <select value={nuevoRegistro.turno} onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, turno: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 4 }}>
                                <option value="Mañana">Mañana</option>
                                <option value="Tarde">Tarde</option>
                                <option value="Noche">Noche</option>
                                <option value="Largo">Largo</option>
                            </select>
                        </div>
                        <div style={{ marginBottom: 12, display: "flex", gap: 12 }}>
                            <div style={{ flex: 1 }}>
                                <label>Hora inicio:</label>
                                <input type="time" value={nuevoRegistro.horaInicio} onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, horaInicio: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 4 }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label>Hora fin:</label>
                                <input type="time" value={nuevoRegistro.horaFin} onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, horaFin: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 4 }} />
                            </div>
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <label>Horas:</label>
                            <input type="number" value={nuevoRegistro.horas} onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, horas: Number(e.target.value) })} style={{ width: "100%", padding: 8, marginTop: 4 }} />
                        </div>
                        <div style={{ marginBottom: 12 }}>
                            <label>Observaciones:</label>
                            <textarea value={nuevoRegistro.observaciones} onChange={(e) => setNuevoRegistro({ ...nuevoRegistro, observaciones: e.target.value })} style={{ width: "100%", padding: 8, marginTop: 4, minHeight: 60 }} />
                        </div>
                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                            <button className="tab-btn" onClick={() => setShowHistorialModal(false)}>Cancelar</button>
                            <button className="estad-link-btn" onClick={handleAddRegistro} disabled={saving || !nuevoRegistro.fecha}>{saving ? "Guardando..." : "Guardar"}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}