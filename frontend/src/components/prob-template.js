import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./header";
import "../style/prob.css";
import { fetchProbabilidadesMedicamentosByUser } from "../api/funcionarios";

const CATS = ["Todos", "Analgésicos", "Antibióticos", "Cardíacos", "Antidiabéticos"];

export default function ProbTemplate() {
    const navigate = useNavigate();
    const { id: routeId } = useParams();
    const userId = routeId || window.localStorage.getItem("currentUserId") || null;

    const [items, setItems] = useState([]);
    const [cat, setCat] = useState("Todos");
    const [loading, setLoading] = useState(true);
    const [gridKey, setGridKey] = useState(0); // para animar desvanecimiento al cambiar categoría

    useEffect(() => {
        let mounted = true;
        if (!userId) { setItems([]); setLoading(false); return; }
        setLoading(true);
        fetchProbabilidadesMedicamentosByUser(userId)
            .then((rows) => mounted && setItems(Array.isArray(rows) ? rows : []))
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, [userId]);

    // al cambiar de categoría, fuerza re-mount del grid para animar fade-in
    useEffect(() => {
        setGridKey((k) => k + 1);
    }, [cat]);

    const data = useMemo(() => {
        if (cat === "Todos") return items;
        return items.filter((x) => x.grupo === cat);
    }, [items, cat]);

    const color = (p) => (p >= 80 ? "green" : p >= 40 ? "yellow" : "red");

    return (
        <div className="prob-bg">
            <Header onBack={() => navigate(-1)} title="Probabilidades de medicamentos" />
            <main className="prob-main">
                <h1 className="prob-title">Análisis de Interacciones</h1>

                <nav className="prob-filter">
                    {CATS.map((c) => (
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
                                    <div className="avatar">{m.nombre.charAt(0).toUpperCase()}</div>
                                    <div className="meta">
                                        <div className="name">{m.nombre}</div>
                                        <div className="group">{m.grupo}</div>
                                    </div>
                                    <div className="progress-row">
                                        <div className="bar">
                                            <div className={`fill ${color(m.pct)}`} style={{ width: `${m.pct}%` }} />
                                        </div>
                                        <div className="pct">{m.pct}%</div>
                                    </div>
                                </article>
                            ))}
                        </section>
                    )}
            </main>
        </div>
    );
}