import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import "../style/sis.css";

export default function EstadisticasSistema() {
    const navigate = useNavigate();

    const cards = [
        { id: 1, value: "87%", label: "Precisión General", color: "teal" },
        { id: 2, value: "1,247", label: "Análisis Realizados", color: "green" },
        { id: 3, value: "23", label: "Alertas Activas", color: "yellow" },
        { id: 4, value: "5", label: "Riesgo Críticos", color: "red" },
    ];

    return (
        <div className="sis-bg">
            <Header onBack={() => navigate(-1)} title="Estadísticas del sistema" />
            <main className="sis-main">
                <h2 className="sis-heading">Efectividad por Categoria</h2>

                <section className="sis-grid">
                    {cards.map((c) => (
                        <div className="sis-card" key={c.id}>
                            <div className={`sis-value ${c.color}`}>{c.value}</div>
                            <div className="sis-label">{c.label}</div>
                        </div>
                    ))}
                </section>
            </main>
        </div>
    );
}