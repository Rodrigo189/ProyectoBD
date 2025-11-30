import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import "../styles/probabilidades.css";
import { fetchProbabilidadesMedicamentosByUser } from "./funcionariosApi";

export default function ProbTemplate() {
    const navigate = useNavigate();
    const { id: routeId } = useParams();
    const userId = routeId || window.localStorage.getItem("currentUserId") || null;

    const [items, setItems] = useState([]);
    const [cat, setCat] = useState("Todos");
    const [loading, setLoading] = useState(true);
    const [gridKey, setGridKey] = useState(0); // animación al cambiar categoría

    // Normaliza la respuesta del backend a [{id, nombre, grupo, pct}]
    const normalize = (rows) => {
        const raw = Array.isArray(rows)
            ? rows
            : Array.isArray(rows?.medicamentos)
                ? rows.medicamentos
                : [];
        return raw.map((m, i) => ({
            id: m.id ?? `${m.nombre || "med"}-${i}`,
            nombre: m.nombre || m.name || "—",
            grupo: m.grupo || m.category || "Otros",
            pct: Number(m.pct ?? m.porcentaje ?? m.percent ?? 0),
        }));
    };

    useEffect(() => {
        let mounted = true;
        if (!userId) { setItems([]); setLoading(false); return; }
        setLoading(true);
        fetchProbabilidadesMedicamentosByUser(userId)
            .then((rows) => mounted && setItems(normalize(rows)))
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, [userId]);

    useEffect(() => { setGridKey((k) => k + 1); }, [cat]);

    // Categorías dinámicas
    const categories = useMemo(() => ["Todos", ...Array.from(new Set(items.map(x => x.grupo)))], [items]);

    const data = useMemo(() => {
        if (cat === "Todos") return items;
        return items.filter((x) => x.grupo === cat);
    }, [items, cat]);

    const color = (p) => (p >= 80 ? "green" : p >= 40 ? "yellow" : "red");
    // Puedes poner esto en ProbTemplate.jsx
    function getGradientColor(pct) {
        // Rojo:   rgb(255, 72, 72)
        // Amarillo: rgb(255, 221, 51)
        // Verde:  rgb(72, 199, 72)
        let r, g, b;
        if (pct <= 50) {
            // De rojo a amarillo
            // pct: 0 -> rojo, 50 -> amarillo
            r = 255;
            g = Math.round(72 + (221 - 72) * (pct / 50));
            b = Math.round(72 + (51 - 72) * (pct / 50));
        } else {
            // De amarillo a verde
            // pct: 50 -> amarillo, 100 -> verde
            r = Math.round(255 - (255 - 72) * ((pct - 50) / 50));
            g = Math.round(221 + (199 - 221) * ((pct - 50) / 50));
            b = Math.round(51 + (72 - 51) * ((pct - 50) / 50));
        }
        return `rgb(${r},${g},${b})`;
    }

    return (
        <div className="prob-bg">
            <Header onBack={() => navigate(-1)} title="Probabilidades de medicamentos" />
            <main className="prob-main">
                <h1 className="prob-title">Análisis de Interacciones</h1>
                <h1 className="prob-subtitle">Cantidad de Medicamentos</h1>
                <nav className="prob-filter">
                    {categories.map((c) => (
                        <button
                            key={c}
                            className={`prob-pill ${c === cat ? "active" : ""}`}
                            onClick={() => setCat(c)}
                        >
                            {c}
                        </button>
                    ))}
                </nav>

                {(!userId && <p style={{ padding: 8 }}>Selecciona un funcionario.</p>) ||
                    (loading ? <p className="loading">Cargando...</p> :
                        <section key={gridKey} className="prob-grid fade-in">
                            {data.map((m) => (
                                <article key={m.id} className="prob-item">
                                    <div className="avatar">{(m.nombre || "?").charAt(0).toUpperCase()}</div>
                                    <div className="meta">
                                        <div className="name">{m.nombre}</div>
                                        <div className="group">{m.grupo}</div>
                                    </div>
                                    <div className="cuantity">Cantidad</div>
                                    <div className="progress-row">
                                        <div className="bar">
                                            <div className="fill" style={{ width: `${m.pct}%`, background: getGradientColor(m.pct) }} />
                                        </div>
                                        <div className="pct">{m.pct}/100</div>
                                    </div>
                                </article>
                            ))}
                            {data.length === 0 && (
                                <div className="prob-empty">Sin medicamentos en esta categoría.</div>
                            )}
                        </section>
                    )}
            </main>
        </div>
    );
}