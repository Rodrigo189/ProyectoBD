import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import "../style/risk.css";

const MOCK = [
    { id: 1, title: "Interacción Aspirina + Paracetamol", level: "Bajo", color: "green" },
    { id: 2, title: "Dosificación Paracetamol", level: "Medio", color: "yellow" },
    { id: 3, title: "Contraindicación Losartán", level: "Alto", color: "red" },
];

export default function Riesgo() {
    const navigate = useNavigate();

    return (
        <div className="riesgo-bg">
            <Header onBack={() => navigate(-1)} title="Análisis de Riesgo" />

            <main className="riesgo-main">

                {/* título principal centrado dentro del contenido */}
                <h2 className="riesgo-heading">Análisis de Riesgo</h2>

                <div className="riesgo-container">
                    <section className="riesgo-list">
                        {MOCK.map((m) => (
                            <div key={m.id} className="riesgo-row">
                                <div className="riesgo-stripe" />
                                <div className="riesgo-content">
                                    <div className="riesgo-title">{m.title}</div>
                                </div>
                                <div className={`riesgo-pill ${m.color}`}>{m.level}</div>
                            </div>
                        ))}
                    </section>
                    {/* ...existing code... */}
                    <aside className="riesgo-side">
                        <div className="patient-card">
                            <div><strong>Paciente:</strong> Nombre Apellido</div>
                            <div><strong>Edad:</strong> 42 años</div>
                            <div><strong>Peso:</strong> 78 kg</div>
                            <div><strong>Alergias:</strong> Penicilina</div>
                        </div>

                        <div className="recommend-card">
                            <h3>Recomendaciones</h3>
                            <ul>
                                <li>Reducir dosis de paracetamol a 500 mg c/8hrs</li>
                                <li>Monitorizar función renal cada 48 hrs</li>
                                <li>Considerar alternativa a losartán</li>
                                <li>Control de presión arterial frecuente</li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}