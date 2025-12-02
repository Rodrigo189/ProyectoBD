import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import Calendario from "./Calendar";
import {
    fetchFuncionarioById,
    fetchResumenByUserMonth,
    fetchSisByRut,
} from "./funcionariosApi";

/**
 * Props:
 *  - forceId (string|null) : opcional, fuerza usar este id en vez del param de ruta
 *  - showFuncionariosButton (bool) : si true muestra botón "Ver Funcionarios"
 *  - onShowFuncionarios (func) : callback al click del botón
 */
export default function FuncionarioDashboard({
    forceId = null,
    showFuncionariosButton = false,
    onShowFuncionarios = null,
}) {
    const params = useParams();
    const routeId = params?.id || null;

    // id de usuario mostrado en el dashboard (ruta o prop)
    const id = forceId || routeId;

    // id para navegar al hub de estadísticas:
    const currentUserId = window.localStorage.getItem("currentUserId") || null;
    const navId = id || currentUserId || null;

    // rol de usuario
    const currentUserRole = window.localStorage.getItem("currentUserRole") || null;

    const shouldShowFuncionarios = !!showFuncionariosButton && !id;
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [activeTab, setActiveTab] = useState("resumen"); // resumen | calendario | historial
    const [menuOpen, setMenuOpen] = useState(false);

    const [month, setMonth] = useState(null);
    const [resumen, setResumen] = useState(null);
    const [resumenLoading, setResumenLoading] = useState(false);

    const [historial, setHistorial] = useState([]);
    const [histLoading, setHistLoading] = useState(false);

    // cargar datos base del usuario (cuando cambia id)
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

        return () => {
            mounted = false;
        };
    }, [id, currentUserId]);

    // cargar resumen mensual cuando cambian data o month
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
            setResumenLoading(false);
        })();
        return () => {
            mounted = false;
        };
    }, [data, month]);

    // cargar historial desde SIS (registros variados por usuario)
    useEffect(() => {
        let mounted = true;
        if (!data || !data.id) {
            setHistorial([]);
            return;
        }
        setHistLoading(true);
        (async () => {
            try {
                const sis = await fetchSisByRut(data.id); // CAMBIO: viene de /api/sis/:rut
                if (!mounted) return;
                setHistorial(Array.isArray(sis?.registros) ? sis.registros : []);
            } finally {
                if (mounted) setHistLoading(false);
            }
        })();
        return () => {
            mounted = false;
        };
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

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    const availableMonths =
        data && data.resumen
            ? Object.keys(data.resumen).map((k) => Number(k)).sort((a, b) => a - b)
            : [];

    const handleVerFuncionariosClick = () => {
        if (typeof onShowFuncionarios === "function") return onShowFuncionarios();
        navigate("/ListaFuncionarioRyE");
    };

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
                                    {/* CAMBIO: usar rut si está disponible */}
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

                    <div className="menu-row">
                        <div className="menu-left">
                            <div className={`tab-menu ${menuOpen ? "open" : ""}`}>
                                <button
                                    className={`tab-btn ${activeTab === "resumen" ? "active" : ""}`}
                                    onClick={() => { setActiveTab("resumen"); setMenuOpen(false); }}
                                >
                                    Resumen
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === "calendario" ? "active" : ""}`}
                                    onClick={() => { setActiveTab("calendario"); setMenuOpen(false); }}
                                >
                                    Calendario
                                </button>
                                <button
                                    className={`tab-btn ${activeTab === "historial" ? "active" : ""}`}
                                    onClick={() => { setActiveTab("historial"); setMenuOpen(false); }}
                                >
                                    Historial
                                </button>
                            </div>
                        </div>

                        <div className="menu-right">
                            <button
                                className="estad-link-btn"
                                onClick={() => navigate(navId ? `/Estadisticas/${navId}` : `/Estadisticas`)}
                            >
                                Ver Estadísticas
                            </button>

                            {shouldShowFuncionarios && (
                                <button
                                    className="estad-link-btn"
                                    style={{ marginLeft: 10 }}
                                    onClick={handleVerFuncionariosClick}
                                >
                                    Ver Funcionarios
                                </button>
                            )}
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
                                            const m = i + 1;
                                            const disabled = availableMonths.length > 0 && !availableMonths.includes(m);
                                            return (
                                                <option key={m} value={m} disabled={disabled}>
                                                    {mn}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                {resumenLoading ? (
                                    <p>Cargando resumen...</p>
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

                        {activeTab === "calendario" && (
                            <div className="calendario-panel">
                                <Calendario
                                    year={new Date().getFullYear()}
                                    month={month || new Date().getMonth() + 1}
                                    entries={historial}
                                    firstDayMonday={true}
                                    onDayClick={(dayIso, entriesForDay) => console.log("día clic:", dayIso, entriesForDay)}
                                    onMonthChange={(m) => setMonth(m)}
                                    onYearChange={() => { }}
                                />
                            </div>
                        )}

                        {activeTab === "historial" && (
                            <div className="historial-panel">
                                {histLoading ? (
                                    <p>Cargando historial...</p>
                                ) : (
                                    <table className="historial-table">
                                        <thead>
                                            <tr>
                                                <th>Fecha</th><th>Día</th><th>Turno</th><th>Horario</th><th>Horas</th><th>Observaciones</th>
                                            </tr>
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