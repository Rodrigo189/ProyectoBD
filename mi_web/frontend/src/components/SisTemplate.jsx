import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import "../styles/sistema.css";
import { fetchEstadisticasSistema } from "./funcionariosApi";

export default function SisTemplate() {
    const navigate = useNavigate();
    const { id: routeId } = useParams();
    const userId = routeId || null;

    const [periodo] = useState("mensual");
    const [year] = useState(new Date().getFullYear());
    const [month] = useState(new Date().getMonth() + 1);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        fetchEstadisticasSistema({ periodo, year, month, userId })
            .then((d) => { if (mounted) setData(d); })
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, [periodo, year, month, userId]);

    return (
        <div className="sis-bg">
            <Header onBack={() => navigate(-1)} title="Estadísticas del sistema" />
            <main className="sis-main">
                <h2 className="sis-heading">Efectividad por Categoria</h2>

                {loading ? (
                    <p className="loading">Cargando...</p>
                ) : (
                    <section className="sis-grid">
                        <div className="sis-card">
                            <div className="sis-value teal">
                                {Math.round((data?.totals?.horasTotales ?? 0) / (data?.totals?.funcionariosActivos || 1))}%
                            </div>
                            <div className="sis-label">Precisión General</div>
                        </div>
                        <div className="sis-card">
                            <div className="sis-value green">{(data?.totals?.horasTotales ?? 0).toLocaleString("es-CL")}</div>
                            <div className="sis-label">Análisis Realizados</div>
                        </div>
                        <div className="sis-card">
                            <div className="sis-value yellow">{data?.totals?.turnosExtraTotales ?? 0}</div>
                            <div className="sis-label">Alertas Activas</div>
                        </div>
                        <div className="sis-card">
                            <div className="sis-value red">{data?.totals?.incidentesTotales ?? 0}</div>
                            <div className="sis-label">Riesgo Críticos</div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}