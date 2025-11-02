import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/header";
import "../style/funlist.css";
import perfil from "../img/perfil.png";

// Mock: reemplazar con llamada real a tu API
const mockFetchFuncionarios = () =>
    Promise.resolve([
        { id: "1", nombre: "Juanito Pérez", cargo: "Jefe de Departamento", email: "juan.perez@eleam.cl", avatar: perfil },
        { id: "2", nombre: "María Gómez", cargo: "Auxiliar", email: "maria.gomez@eleam.cl", avatar: perfil },
        { id: "3", nombre: "Carlos Ruiz", cargo: "Enfermero", email: "carlos.ruiz@eleam.cl", avatar: perfil },
        { id: "4", nombre: "Ana Torres", cargo: "Médico", email: "ana.torres@eleam.cl", avatar: perfil },
        { id: "5", nombre: "Laura Díaz", cargo: "Enfermera", email: "laura.diaz@eleam.cl", avatar: perfil },
        { id: "6", nombre: "Pedro Soto", cargo: "Auxiliar", email: "pedro.soto@eleam.cl", avatar: perfil },
        { id: "7", nombre: "Sofía Reyes", cargo: "Médico", email: "sofia.reyes@eleam.cl", avatar: perfil },
        { id: "8", nombre: "Miguel Lara", cargo: "Enfermero", email: "miguel.lara@eleam.cl", avatar: perfil },
    ]);

export default function ListaFuncionario() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        mockFetchFuncionarios()
            .then((data) => {
                if (!mounted) return;
                setItems(data);
                setLoading(false);
            })
            .catch(() => {
                if (!mounted) return;
                setItems([]);
                setLoading(false);
            });
        return () => (mounted = false);
    }, []);

    return (
        <div className="funcionarios-bg">
            <Header />

            <main className="funcionarios-main">
                <div className="funcionarios-frame">
                    <div className="funcionarios-top">
                        <h1 className="funcionarios-title">Funcionarios</h1>
                    </div>

                    <section className="funcionarios-grid-wrap">
                        {loading ? (
                            <p className="loading">Cargando...</p>
                        ) : (
                            <div className="funcionarios-grid">
                                {items.map((f) => (
                                    <Link
                                        key={f.id}
                                        to={`/funcionarios/${f.id}`}
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