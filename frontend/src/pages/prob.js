import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import "../style/prob.css";

const MOCK = [
    { id: "asp", name: "Aspirina", grupo: "Analgésicos", pct: 85 },
    { id: "ibu", name: "Ibuprofeno", grupo: "Analgésicos", pct: 45 },
    { id: "par", name: "Paracetamol", grupo: "Analgésicos", pct: 92 },
    { id: "amo", name: "Amoxicilina", grupo: "Antibióticos", pct: 78 },
    { id: "los", name: "Losartán", grupo: "Cardíacos", pct: 15 },
    { id: "met", name: "Metformina", grupo: "Antidiabéticos", pct: 67 },
];

const CATS = ["Todo", "Analgésicos", "Antibióticos", "Cardíacos", "Antidiabéticos"];

export default function Probabilidades() {
    const navigate = useNavigate();
    const [cat, setCat] = useState("Todo");

    // estados para animación: primero anim-out, luego cambiar cat y anim-in
    const [isSwitching, setIsSwitching] = useState(false);
    const [justChanged, setJustChanged] = useState(false);

    const handleCategoryChange = (c) => {
        if (c === cat) return;
        // animar salida
        setIsSwitching(true);
        window.setTimeout(() => {
            setCat(c);
            setIsSwitching(false);
            // animar entrada
            setJustChanged(true);
            window.setTimeout(() => setJustChanged(false), 420);
        }, 220); // coincide con CSS
    };

    const items = useMemo(() => {
        if (cat === "Todo") return MOCK;
        return MOCK.filter((m) => m.grupo === cat);
    }, [cat]);

    const pctColor = (p) => {
        if (p >= 80) return "green";
        if (p >= 40) return "yellow";
        return "red";
    };

    return (
        <div className="prob-bg">
            <Header onBack={() => navigate(-1)} title="Probabilidades de medicamentos" />
            <main className="prob-main">
                <section className="prob-card">
                    <h2 className="prob-title">Análisis de Interacciones</h2>

                    <nav className="prob-filter">
                        {CATS.map((c) => (
                            <button
                                key={c}
                                className={`prob-pill ${c === cat ? "active" : ""}`}
                                onClick={() => handleCategoryChange(c)}
                            >
                                {c}
                            </button>
                        ))}
                    </nav>

                    <div className={`prob-grid ${isSwitching ? "switching-out" : ""}`}>
                        {items.map((it) => (
                            <article
                                key={it.id}
                                className={`prob-item ${isSwitching ? "animate-out" : ""} ${justChanged ? "animate-in" : ""}`}
                            >
                                <div className="avatar">{it.name.charAt(0).toUpperCase()}</div>
                                <div className="meta">
                                    <div className="name">{it.name}</div>
                                    <div className="group">{it.grupo}</div>
                                </div>

                                <div className="progress-row">
                                    <div className="bar">
                                        <div
                                            className={`fill ${pctColor(it.pct)}`}
                                            style={{ width: `${it.pct}%` }}
                                        />
                                    </div>
                                    <div className="pct">{it.pct}%</div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}