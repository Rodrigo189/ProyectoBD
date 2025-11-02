import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Fundash from "./fundash";
import Funlist from "./funlist"; // asumimos exporta una lista o componente reutilizable
import "../style/admindash.css";

export default function AdminDash() {
    const navigate = useNavigate();
    const [funcionarios, setFuncionarios] = useState([]);
    const [selected, setSelected] = useState(null);

    // ejemplo: cargar lista (más tarde conectar al backend real)
    useEffect(() => {
        // si ya tienes api/funcionarios.js puedes usarlo aquí; por ahora mock o fetch
        import("../api/funcionarios").then((m) => {
            if (m && m.getAll) {
                m.getAll().then((data) => setFuncionarios(data || []));
            } else {
                // fallback mock
                setFuncionarios([
                    { id: "f1", name: "Juan Pérez" },
                    { id: "f2", name: "María Gómez" },
                    { id: "f3", name: "Carlos Ruiz" },
                ]);
            }
        });
    }, []);

    const handleSelect = (f) => {
        setSelected(f);
    };

    return (
        <div className="adm-bg">
            <header className="adm-header">
                <button className="adm-back" onClick={() => navigate(-1)}>Atrás</button>
                <h1>Panel Administrador</h1>
            </header>

            <main className="adm-main">
                <aside className="adm-left">
                    <div className="adm-actions">
                        <button className="adm-btn" onClick={() => setSelected(null)}>Mis estadísticas</button>
                        <button className="adm-btn" onClick={() => setSelected(null)}>Refrescar</button>
                    </div>

                    <div className="adm-list">
                        {/* Si Funlist exporta un componente visual únelo; si no, render simple */}
                        {funcionarios.map((f) => (
                            <div
                                key={f.id}
                                className={`adm-list-item ${selected && selected.id === f.id ? "active" : ""}`}
                                onClick={() => handleSelect(f)}
                            >
                                <div className="name">{f.name}</div>
                                <div className="id">#{f.id}</div>
                            </div>
                        ))}
                    </div>
                </aside>

                <section className="adm-right">
                    {/* si selected==null mostramos las estadísticas del admin (o del auth),
              si selected existe pasamos ese funcionario a Fundash */}
                    <Fundash user={selected} />
                </section>
            </main>
        </div>
    );
}