import React from "react";
import "../style/perf-fun.css";
import Header from "../components/header";
import perfil from "../img/perfil.png";

export default function PerfilFuncionario() {
    const goBack = () => { if (window.history.length > 1) window.history.back(); };

    return (
        <div className="perfil-bg">
            <Header onBack={goBack} />
            <main className="perfil-main">
                <div className="perfil-frame">
                    <section className="perfil-card">
                        <div className="perfil-left">
                            <div className="perfil-avatar" aria-hidden="true">
                                <img src={perfil} alt="Perfil" className="perfil-conf" />
                            </div>

                            <div className="perfil-details">
                                <p><span className="label">Nombre(s):</span> .................</p>
                                <p><span className="label">Apellido(s):</span> ..............</p>
                                <p><span className="label">RUN:</span> xx.xxx.xxx-x</p>
                                <p><span className="label">Género:</span> ...............</p>
                                <p><span className="label">Cargo:</span> ..................</p>
                            </div>
                        </div>

                        <div className="perfil-right">
                            <p><span className="label">Dirección:</span> ...............</p>
                            <p><span className="label">Email:</span> ejemplo@eleam.cl</p>
                            <p><span className="label">Teléfono:</span> (+569)xxxxxxxx</p>
                            <p><span className="label">Fecha de nacimiento:</span> xx/xx/xxxx</p>
                        </div>
                    </section>

                    <section className="perfil-contract">
                        <div className="contract-left">
                            <p><strong>Tipo de contrato:</strong> ......................</p>
                            <p><strong>Fecha de inicio de contrato:</strong> xx/xx/xxxx</p>
                            <p><strong>Fecha de término de contrato:</strong> xx/xx/xxxx</p>
                            <p><strong>Bonos:</strong> ............</p>
                            <p><strong>Tipos de Bonos:</strong> ......</p>
                        </div>

                        <aside className="contract-box">
                            <p><strong>Sueldo Bruto:</strong> $$$.$$$</p>
                            <p><strong>Sueldo Líquido:</strong> $$$.$$$</p>
                            <p><strong>Bonos:</strong> $$$.$$$</p>
                            <hr />
                            <p><strong>Total:</strong> $$$.$$$</p>
                            <p><strong>Fecha de pago:</strong> xx/xx/xxxx</p>
                        </aside>
                    </section>
                </div>
            </main>
        </div>
    );
}