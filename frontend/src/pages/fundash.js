import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/header";
import "../style/perf-fun.css";
import Calendario from "../components/calender";
import {
    fetchFuncionarioById,
    listFuncionarios,
    fetchResumenByUserMonth,
    fetchHistorialByUser,
} from "../api/funcionarios";

export default function FuncionarioDashboard({ user }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("resumen"); // resumen | Calendario | historial
    const [menuOpen, setMenuOpen] = useState(false);

    const [month, setMonth] = useState(null);
    const [resumen, setResumen] = useState(null);
    const [resumenLoading, setResumenLoading] = useState(false);
    const [historial, setHistorial] = useState([]);
    const [histLoading, setHistLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                let f = null;
                if (id) {
                    f = await fetchFuncionarioById(id);
                } else {
                    const all = await listFuncionarios();
                    f = all && all.length ? all[0] : null;
                }
                if (!mounted) return;
                setData(f);

                if (f) {
                    const months = f.resumen ? Object.keys(f.resumen).map((k) => Number(k)).filter(Boolean) : [];
                    if (months.length) setMonth((prev) => (prev === null ? months[0] : prev));
                    else setMonth((prev) => (prev === null ? new Date().getMonth() + 1 : prev));
                }
            } catch (err) {
                console.error("Error cargando funcionario:", err);
                if (mounted) setData(null);
            } finally {
                if (mounted) setLoading(false);
            }
        })();
        return () => (mounted = false);
    }, [id]);

    useEffect(() => {
        let mounted = true;
        if (!data || !data.id || month == null) {
            setResumen(null);
            return;
        }
        setResumenLoading(true);
        (async () => {
            try {
                const r = await fetchResumenByUserMonth(data.id, month);
                if (!mounted) return;
                setResumen(r);
            } catch (err) {
                console.error("Error cargando resumen:", err);
                if (mounted) setResumen(null);
            } finally {
                if (mounted) setResumenLoading(false);
            }
        })();
        return () => (mounted = false);
    }, [data, month]);

    useEffect(() => {
        let mounted = true;
        if (!data || !data.id) {
            setHistorial([]);
            return;
        }
        setHistLoading(true);
        (async () => {
            try {
                const h = await fetchHistorialByUser(data.id);
                if (!mounted) return;
                setHistorial(h);
            } catch (err) {
                console.error("Error cargando historial:", err);
                if (mounted) setHistorial([]);
            } finally {
                if (mounted) setHistLoading(false);
            }
        })();
        return () => (mounted = false);
    }, [data]);

    if (loading)
        return (
            <div className="perfil-bg">
                <Header onBack={() => navigate(-1)} />
                <main className="perfil-main">
                    <div className="perfil-frame">Cargando...</div>
                </main>
            </div>
        );

    if (!data)
        return (
            <div className="perfil-bg">
                <Header onBack={() => navigate(-1)} />
                <main className="perfil-main">
                    <div className="perfil-frame">Funcionario no encontrado</div>
                </main>
            </div>
        );

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const availableMonths = data && data.resumen ? Object.keys(data.resumen).map((k) => Number(k)).sort((a, b) => a - b) : [];

    return (
        <div className="perfil-bg">
            <Header onBack={() => navigate(-1)} />
            <main className="perfil-main">
                <div className="perfil-frame">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                        <section className="perfil-card" style={{ flex: 1 }}>
                            <div className="perfil-left">
                                <div className="perfil-avatar" aria-hidden="true">
                                    <img src={data.avatar} alt="Perfil" className="perfil-conf" />
                                </div>
                                <div className="perfil-details">
                                    <p><span className="label">Nombre(s):</span> {data.nombre}</p>
                                    <p><span className="label">Apellido(s):</span> {data.apellido}</p>
                                    <p><span className="label">RUN:</span> {data.run}</p>
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

                    <div className="menu-row">
                        <div className="menu-left">
                            <button
                                className="hamburger"
                                onClick={() => setMenuOpen((s) => !s)}
                                aria-expanded={menuOpen}
                                aria-label="Abrir menú"
                            >
                                ☰
                            </button>

                            <div className={`tab-menu ${menuOpen ? "open" : ""}`}>
                                <button className={`tab-btn ${activeTab === "resumen" ? "active" : ""}`} onClick={() => { setActiveTab("resumen"); setMenuOpen(false); }}>Resumen</button>
                                <button className={`tab-btn ${activeTab === "calendario" ? "active" : ""}`} onClick={() => { setActiveTab("calendario"); setMenuOpen(false); }}>Calendario</button>
                                <button className={`tab-btn ${activeTab === "historial" ? "active" : ""}`} onClick={() => { setActiveTab("historial"); setMenuOpen(false); }}>Historial</button>
                            </div>
                        </div>

                        <div className="menu-right">
                            <button
                                className="estad-link-btn"
                                onClick={() => navigate("/Estadisticas")}
                            >
                                Ver Estadísticas
                            </button>
                        </div>
                    </div>




                    <section style={{ marginTop: 14 }}>
                        {activeTab === "resumen" && (
                            <div className="resumen-panel">
                                <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center", marginBottom: 12, gap: 12 }}>
                                    <strong>Mes:</strong>
                                    <select
                                        className="month-select"
                                        value={month ?? ""}
                                        onChange={(e) => setMonth(Number(e.target.value))}
                                    >
                                        {monthNames.map((mn, i) => {
                                            const mnum = i + 1;
                                            const has = availableMonths.includes(mnum);
                                            return (
                                                <option key={mnum} value={mnum} data-has={has}>
                                                    {mn}{has ? " •" : ""}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                {resumenLoading ? <p>Cargando resumen...</p> : (
                                    resumen && (Object.values(resumen).some(v => v !== 0) ? (
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
                                    ))
                                )}
                            </div>
                        )}


                        {activeTab === "calendario" && (
                            <div className="calendario-panel">
                                <Calendario
                                    year={new Date().getFullYear()}
                                    month={month || (new Date().getMonth() + 1)}
                                    entries={historial}
                                    firstDayMonday={true}
                                    onDayClick={(dayIso, entriesForDay) => console.log("día clic:", dayIso, entriesForDay)}
                                    onMonthChange={(m) => setMonth(m)}
                                    onYearChange={(y) => { /* opcional: manejar cambio de año si lo necesitas */ }}
                                />
                            </div>
                        )}

                        {activeTab === "historial" && (
                            <div className="historial-panel">
                                {histLoading ? <p>Cargando historial...</p> : (
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
        </div>
    );
}