import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header";
import "../styles/dashboardlist.css";
import perfil from "../img/perfil.png";

// fallback simple (puedes reemplazarlo vía prop)
const defaultFetchFuncionarios = () =>
    Promise.resolve([
        { id: "1", nombre: "Juanito Pérez", cargo: "Jefe de Departamento", email: "juan.perez@eleam.cl", avatar: perfil },
        { id: "2", nombre: "María Gómez", cargo: "Auxiliar", email: "maria.gomez@eleam.cl", avatar: perfil },
        { id: "3", nombre: "Carlos Ruiz", cargo: "Enfermero", email: "carlos.ruiz@eleam.cl", avatar: perfil },
        { id: "4", nombre: "Ana Torres", cargo: "Médico", email: "ana.torres@eleam.cl", avatar: perfil },
    ]);

export default function FuncionariosListTemplate({
    title = "Funcionarios",
    fetchFuncionarios = defaultFetchFuncionarios,
    onSelect, // (funcionario) => void
}) {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        fetchFuncionarios()
            .then((data) => {
                if (!mounted) return;
                setItems(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => {
                if (!mounted) return;
                setItems([]);
                setLoading(false);
            });
        return () => (mounted = false);
    }, [fetchFuncionarios]);

    const handleSelect = (f) => {
        if (typeof onSelect === "function") return onSelect(f);
        // Fallback: mismo comportamiento que la lista original
        navigate(`/funcionarios/${f.id}`);
    };

    return (
        <div className="funcionarios-bg">
            <Header />
            <main className="funcionarios-main">
                <div className="funcionarios-frame">
                    <div className="funcionarios-top">
                        <h1 className="funcionarios-title">{title}</h1>
                    </div>

                    <section className="funcionarios-grid-wrap">
                        {loading ? (
                            <p className="loading">Cargando...</p>
                        ) : (
                            <div className="funcionarios-grid">
                                {items.map((f) => (
                                    <Link
                                        key={f.id}
                                        to="#"
                                        onClick={(e) => { e.preventDefault(); handleSelect(f); }}
                                        className="funcionario-card"
                                        aria-label={`Ver perfil ${f.nombre}`}
                                    >
                                        <div className="funcionario-avatar">
                                            <img src={f.avatar || perfil} alt={`${f.nombre} avatar`} />
                                        </div>

                                        <div className="funcionario-info">
                                            <div className="funcionario-name">{f.nombre}</div>
                                            <div className="funcionario-role">{f.cargo}</div>
                                            <div className="funcionario-email">{f.email}</div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}