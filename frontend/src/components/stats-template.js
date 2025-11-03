import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./header";
import "../style/stats.css";

// Importa tus 3 imágenes del slider
import slideProb from "../img/bienvenida_estadisticas1.jpg";
import slideRisk from "../img/bienvenida_estadisticas2.jpg";
import slideSis from "../img/bienvenida_estadisticas3.jpg";

export default function StatsTemplate() {
    const navigate = useNavigate();
    const { id: routeId } = useParams();
    const userId = routeId || null;

    // Slides con imágenes y alt
    const slides = [
        { src: slideProb, alt: "Probabilidades de medicamentos" },
        { src: slideRisk, alt: "Análisis de riesgo" },
        { src: slideSis, alt: "Estadísticas del sistema" },
    ];

    const [index, setIndex] = useState(0);
    useEffect(() => {
        const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
        return () => clearInterval(t);
    }, [slides.length]);

    const gotoProb = () => navigate(userId ? `/Probabilidades/${userId}` : "/Probabilidades");
    const gotoRisk = () => navigate(userId ? `/AnalisisRiesgo/${userId}` : "/AnalisisRiesgo");
    const gotoSis = () => navigate(userId ? `/EstadisticasSistema/${userId}` : "/EstadisticasSistema");

    return (
        <div className="estad-bg">
            <Header onBack={() => navigate(-1)} />
            <main className="estad-main">
                <div className="estad-container">
                    <aside className="estad-sidebar">
                        <button className="side-btn" onClick={gotoProb}>
                            <span className="icon" aria-hidden>💊</span>
                            <span>Probabilidades</span>
                        </button>
                        <button className="side-btn" onClick={gotoRisk}>
                            <span className="icon" aria-hidden>⚠️</span>
                            <span>Análisis de Riesgo</span>
                        </button>
                        <button className="side-btn" onClick={gotoSis}>
                            <span className="icon" aria-hidden>📈</span>
                            <span>Estadísticas del sistema</span>
                        </button>
                    </aside>

                    <section className="estad-hero-area">
                        <div className="hero-caption">
                            <h2>Área de Reportes</h2>
                            <p className="help-text">Selecciona una opción para ver datos y gráficos.</p>
                        </div>

                        <div className="estad-hero">
                            <div
                                className="slides"
                                style={{
                                    transform: `translateX(-${index * 100}%)`,
                                    width: `${slides.length * 100}%`,
                                }}
                            >
                                {slides.map((s, i) => (
                                    <div className="slide" key={i}>
                                        <img src={s.src} alt={s.alt} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="hero-controls">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    className={`dot ${i === index ? "active" : ""}`}
                                    onClick={() => setIndex(i)}
                                    aria-label={`Slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}