import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import "../styles/riesgos.css";
import { fetchRiesgosByUser, fetchFuncionarioById } from "./funcionariosApi";

const levelClass = (nivel) => {
    const n = String(nivel || "").toLowerCase();
    if (n.includes("alto")) return "red";
    if (n.includes("medio")) return "yellow";
    return "green";
};

// calcular edad desde fecha de nacimiento
const getAge = (dob) => {
    if (!dob) return "—";
    const d = new Date(dob);
    if (Number.isNaN(d.getTime())) return "—";
    const diff = Date.now() - d.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
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

    // Tomar nacimiento desde el usuario para mostrar edad
    const nacimiento = user?.nacimiento || user?.fechaNacimiento || null;
    const edad = getAge(nacimiento);

    return (
        <div className="riesgo-bg">
            <Header onBack={() => navigate(-1)} />
            <main className="riesgo-main">
                <h1 className="riesgo-title">Análisis de Riesgo</h1>

                {loading ? (
                    <p className="loading">Cargando...</p>
                ) : (
                    <section className="riesgo-content">
                        {/* Columna izquierda: lista de riesgos */}
                        <div className="riesgo-list">
                            {items.map((r, idx) => (
                                <div key={r.id || `${r.tipo}-${r.detalle || ""}-${idx}`} className="riesgo-item">
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

                        {/* Columna derecha: paciente + recomendaciones */}
                        <div className="right-col">
                            <div className="patient-card">
                                <div><strong>Paciente:</strong> {user ? `${user.nombre} ${user.apellido}` : "—"}</div>
                                <div><strong>Edad:</strong> {edad} años <span className="sep">|</span> <strong>Peso:</strong> 70KG</div>
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