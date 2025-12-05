import React, { useEffect, useState } from "react";
import Header from "./Header";
import "../styles/funcionarioProfile.css";
import perfil from "../img/perfil.png";
import { fetchFuncionarioById } from "./funcionariosApi";

export default function PerfilFuncionario() {
    // Hooks primero
    const goBack = () => { if (window.history.length > 1) window.history.back(); };
    const rut = localStorage.getItem("currentUserId") || "";
    const role = localStorage.getItem("currentUserRole");
    const notAuthorized = role !== "funcionario";

    const [fun, setFun] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let alive = true;
        async function load() {
            if (!rut) { setError("No hay RUN en sesión"); setLoading(false); return; }
            try {
                const data = await fetchFuncionarioById(rut);
                if (alive) setFun(data);
            } catch (e) {
                if (alive) setError("No se pudo cargar el funcionario");
            } finally {
                if (alive) setLoading(false);
            }
        }
        load();
        return () => { alive = false; };
    }, [rut]);

    if (notAuthorized) return <div style={{ padding: 16 }}>No autorizado: requiere rol funcionario.</div>;

    // Helpers de formato
    const fmt = (v, d = "—") => (v === 0 ? "0" : (v ?? d));
    const money = (n) =>
        Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 })
            .format(Number(n || 0));

    // Mapeo de posibles nombres de campos en BD
    const nombre = fun?.nombre || "";
    const apellido = fun?.apellido || "";
    const genero = fun?.genero || fun?.sexo || "—";
    const cargo = fun?.cargo || "—";
    const direccion = fun?.direccion || "—";
    const email = fun?.email || "—";
    const telefono = fun?.telefono || "—";
    const nacimiento = fun?.nacimiento || fun?.fechaNacimiento || "—";

    // Contrato y pagos
    const tipoContrato = fun?.tipoContrato || fun?.contrato || "Indefinido";
    const inicio = fun?.inicioContrato || fun?.inicio || "—";
    const termino = fun?.terminoContrato || fun?.termino || "—";
    const bonos = Number(fun?.bonos || 0);
    const tiposBonos = fun?.tiposBonos || "—";
    const sueldoBruto = Number(fun?.sueldoBruto || fun?.bruto || 0);
    const sueldoLiquido = Number(fun?.sueldoLiquido || fun?.liquido || 0);
    const total = sueldoLiquido + bonos;
    const fechaPago = fun?.fechaPago || "—";

    return (
        <div className="perfil-bg">
            <Header onBack={goBack} />
            <main className="perfil-main">
                <div className="perfil-frame">
                    {loading && <div style={{ padding: 16 }}>Cargando…</div>}
                    {error && <div style={{ padding: 16, color: "#b00020" }}>{error}</div>}
                    {!loading && !error && (
                        <>
                            <section className="perfil-card">
                                <div className="perfil-left">
                                    <div className="perfil-avatar" aria-hidden="true">
                                        <img src={perfil} alt="Perfil" className="perfil-conf" />
                                    </div>
                                    <div className="perfil-details">
                                        <p><span className="label">Nombre(s):</span> {fmt(nombre)}</p>
                                        <p><span className="label">Apellido(s):</span> {fmt(apellido)}</p>
                                        <p><span className="label">RUN:</span> {fmt(fun?.rut)}</p>
                                        <p><span className="label">Género:</span> {fmt(genero)}</p>
                                        <p><span className="label">Cargo:</span> {fmt(cargo)}</p>
                                    </div>
                                </div>

                                <div className="perfil-right">
                                    <p><span className="label">Dirección:</span> {fmt(direccion)}</p>
                                    <p><span className="label">Email:</span> {fmt(email)}</p>
                                    <p><span className="label">Teléfono:</span> {fmt(telefono)}</p>
                                    <p><span className="label">Fecha de nacimiento:</span> {fmt(nacimiento)}</p>
                                </div>
                            </section>

                            <section className="perfil-contract">
                                <div className="contract-left">
                                    <p><strong>Tipo de contrato:</strong> {fmt(tipoContrato)}</p>
                                    <p><strong>Fecha de inicio de contrato:</strong> {fmt(inicio)}</p>
                                    <p><strong>Fecha de término de contrato:</strong> {fmt(termino)}</p>
                                    <p><strong>Bonos:</strong> {money(bonos)}</p>
                                    <p><strong>Tipos de Bonos:</strong> {fmt(tiposBonos)}</p>
                                </div>

                                <aside className="contract-box">
                                    <p><strong>Sueldo Bruto:</strong> {money(sueldoBruto)}</p>
                                    <p><strong>Sueldo Líquido:</strong> {money(sueldoLiquido)}</p>
                                    <p><strong>Bonos:</strong> {money(bonos)}</p>
                                    <hr />
                                    <p><strong>Total:</strong> {money(total)}</p>
                                    <p><strong>Fecha de pago:</strong> {fmt(fechaPago)}</p>
                                </aside>
                            </section>

                            {/* Eliminado: bloque de turnos/horas/incidentes/extra (no va aquí) */}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}