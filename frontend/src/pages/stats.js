import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import "../style/stats.css";
import banner1 from "../img/bienvenida_estadisticas1.jpg";
import banner2 from "../img/bienvenida_estadisticas2.jpg";
import banner3 from "../img/bienvenida_estadisticas3.jpg";

export default function Estadisticas() {
    const navigate = useNavigate();

    // slides (si sólo tienes 1 imagen, se replican para efecto slider)
    const slides = [banner1, banner2, banner3];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
        return () => clearInterval(t);
    }, [slides.length]);

    return (
        <div className="estad-bg">
            <Header onBack={() => navigate(-1)} title="Estadísticas" />

            <main className="estad-main">
                <div className="estad-container">
                    <aside className="estad-sidebar" aria-label="Opciones estadísticas">
                        <button className="side-btn" onClick={() => navigate("/Probabilidades")}>
                            <span className="icon">⚖️</span>
                            <span>Probabilidades de<br />Medicamentos</span>
                        </button>

                        <button className="side-btn" onClick={() => navigate("/AnalisisRiesgo")}>
                            <span className="icon">⚠️</span>
                            <span>Análisis de<br />Riesgo</span>
                        </button>

                        <button className="side-btn" onClick={() => navigate("/EstadisticasSistema")}>
                            <span className="icon">📊</span>
                            <span>Estadísticas<br />del sistema</span>
                        </button>
                    </aside>

                    <section className="estad-hero-area">
                        <div className="estad-hero">
                            <div
                                className="slides"
                                style={{ transform: `translateX(-${index * 100}%)`, width: `${slides.length * 100}%` }}
                            >
                                {slides.map((s, i) => (
                                    <div className="slide" key={i}>
                                        <img src={s} alt={`Banner ${i + 1}`} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="hero-controls" role="tablist" aria-label="Controles del banner">
                            {slides.map((_, i) => (
                                <button
                                    key={i}
                                    className={`dot ${i === index ? "active" : ""}`}
                                    onClick={() => setIndex(i)}
                                    aria-label={`Ir al slide ${i + 1}`}
                                />
                            ))}
                        </div>

                        <div className="hero-caption">
                            <h2>Área de Medicamentos</h2>
                            <p className="help-text">Selecciona una opción para ver datos, gráficos y reportes.</p>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}