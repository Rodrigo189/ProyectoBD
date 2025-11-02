import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import "../style/perf-admin.css";
import perfil from "../img/perfil.png";

export default function PerfilAdministrador() {
    const navigate = useNavigate();
    const goBack = () => { if (window.history.length > 1) window.history.back(); };

    const handleVerFuncionarios = () => {
        navigate("/listaFuncionario");
    };

    return (
        <div className="perfil-admin-bg">
            <Header onBack={goBack} />

            <main className="perfil-admin-main">
                <div className="perfil-admin-frame">
                    <div className="perfil-admin-top">
                        <button
                            className="perfil-admin-cta"
                            onClick={handleVerFuncionarios}
                            aria-label="Ver funcionarios"
                        >
                            VER FUNCIONARIOS
                        </button>
                    </div>

                    <section className="perfil-admin-card">
                        <div className="perfil-admin-left">
                            <div className="perfil-admin-avatar">
                                <img src={perfil} alt="avatar" className="perfil-admin-conf" />
                            </div>

                            <div className="perfil-admin-details">
                                <p><span className="label">Nombre(s):</span> Juanito ...........</p>
                                <p><span className="label">Apellido(s):</span> Pérez ..........</p>
                                <p><span className="label">RUN:</span> xx.xxx.xxx-x</p>
                                <p><span className="label">Género:</span> Masculino</p>
                                <p><span className="label">Cargo:</span> Jefe de Departamento</p>
                            </div>
                        </div>

                        <div className="perfil-admin-right">
                            <p><span className="label">Dirección:</span> Calle ejemplo 123</p>
                            <p><span className="label">Email:</span> admin@eleam.cl</p>
                            <p><span className="label">Teléfono:</span> (+569)9xxxxxxx</p>
                            <p><span className="label">Fecha de Nacimiento:</span> 01/01/2000</p>
                        </div>
                    </section>

                    <section className="perfil-admin-contract">
                        <div className="admin-contract-left">
                            <p><strong>Tipo de contrato:</strong> Contrato a plazo</p>
                            <p><strong>Fecha inicio:</strong> 01/01/2024</p>
                            <p><strong>Fecha término:</strong> 31/12/2024</p>
                            <p><strong>Bonos:</strong> Variable</p>
                            <p><strong>Tipos de Bonos:</strong> Desempeño, Asistencia</p>
                        </div>

                        <aside className="admin-contract-box">
                            <p><strong>Sueldo Bruto:</strong> $1.200.000</p>
                            <p><strong>Sueldo Líquido:</strong> $900.000</p>
                            <p><strong>Bonos:</strong> $50.000</p>
                            <hr />
                            <p><strong>Total:</strong> $950.000</p>
                            <p><strong>Fecha de pago:</strong> 30/09/2024</p>
                        </aside>
                    </section>
                </div>
            </main>
        </div>
    );
}