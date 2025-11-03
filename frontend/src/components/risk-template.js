import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./header";
import "../style/risk.css";
import { fetchRiesgosByUser, fetchFuncionarioById } from "../api/funcionarios";

const levelClass = (nivel) => {
    const n = String(nivel || "").toLowerCase();
    if (n.includes("alto")) return "red";
    if (n.includes("medio")) return "yellow";
    return "green";
};

export default function RiskTemplate() {
    const navigate = useNavigate();
    const { id: routeId } = useParams();
    const userId = routeId || window.localStorage.getItem("currentUserId") || null;

    const [user, setUser] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        if (!userId) {
            setUser(null);
            setItems([]);
            setLoading(false);
            return;
        }
        Promise.all([fetchFuncionarioById(userId), fetchRiesgosByUser(userId)])
            .then(([u, r]) => {
                if (!mounted) return;
                setUser(u || null);
                setItems(Array.isArray(r) ? r : []);
            })
            .finally(() => mounted && setLoading(false));

        return () => { mounted = false; };
    }, [userId]);

    return (
        <div className="riesgo-bg">
            <Header onBack={() => navigate(-1)} />
            <main className="riesgo-main">
                <h1 className="riesgo-title">Análisis de Riesgo</h1>

                {loading ? (
                    <p className="loading">Cargando...</p>
                ) : (
                    <section className="riesgo-content">
                        {/* Columna izquierda: lista de riesgos (sin franjas azules) */}
                        <div className="riesgo-list">
                            {items.map((r) => (
                                <div key={r.id} className="riesgo-item">
                                    <div className="r-title">
                                        {r.detalle ? `${r.tipo} + ${r.detalle}` : r.tipo}
                                    </div>
                                    <span className={`riesgo-pill ${levelClass(r.nivel)}`}>{r.nivel}</span>
                                </div>
                            ))}
                            {items.length === 0 && (
                                <div className="empty">Sin riesgos registrados para este funcionario.</div>
                            )}
                        </div>

                        {/* Columna derecha: paciente + recomendaciones alineadas y del mismo ancho */}
                        <div className="right-col">
                            <div className="patient-card">
                                <div><strong>Paciente:</strong> {user ? `${user.nombre} ${user.apellido}` : "—"}</div>
                                <div><strong>Edad:</strong> ## años <span className="sep">|</span> <strong>Peso:</strong> 70KG</div>
                                <div><strong>Alergias:</strong> Penicilina</div>
                            </div>

                            <aside className="recommend-card">
                                <h3>Recomendaciones</h3>
                                <ul>
                                    <li>Reducir dosis de paracetamol a 500 mg c/8hrs</li>
                                    <li>Monitorizar función renal cada 48 hrs</li>
                                    <li>Considerar alternativa a losartán</li>
                                    <li>Control de presión arterial frecuente</li>
                                </ul>
                            </aside>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}