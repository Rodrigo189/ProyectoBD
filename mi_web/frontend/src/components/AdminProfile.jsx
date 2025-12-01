import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/adminProfile.css";
import Header from "./Header";
import perfil from "../img/perfil.png";

export default function PerfilAdministrador() {
    const goBack = () => { if (window.history.length > 1) window.history.back(); };
    const navigate = useNavigate();
    const rut = localStorage.getItem("currentUserId") || "";
    const role = localStorage.getItem("currentUserRole");
    const notAuthorized = role !== "admin";

    const [fun, setFun] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let alive = true;
        async function load() {
            if (!rut) { setError("No hay RUN en sesión"); setLoading(false); return; }
            try {
                const r = await fetch(`/api/funcionarios/${encodeURIComponent(rut)}`);
                const data = await r.json();
                if (!r.ok) throw data;
                if (alive) setFun(data);
            } catch (e) {
                if (alive) setError("No se pudo cargar el administrador");
            } finally {
                if (alive) setLoading(false);
            }
        }
        load();
        return () => { alive = false; };
    }, [rut]);

    if (notAuthorized) return <div style={{ padding: 16 }}>No autorizado: requiere rol administrador.</div>;

    const fmt = (v, d = "—") => (v === 0 ? "0" : (v ?? d));
    const money = (n) => Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(Number(n || 0));

    const nombre = fun?.nombre || "";
    const apellido = fun?.apellido || "";
    const genero = fun?.genero || fun?.sexo || "—";
    const cargo = fun?.cargo || "Administrador";
    const direccion = fun?.direccion || "—";
    const email = fun?.email || "—";
    const telefono = fun?.telefono || "—";
    const nacimiento = fun?.nacimiento || fun?.fechaNacimiento || "—";

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
        <div className="perfil-admin-bg">
            <Header onBack={goBack} />
            <main className="perfil-admin-main">
                <div className="perfil-admin-frame">
                    {/* Botón para ir a la lista de funcionarios */}
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                        <button className="perfil-btn" onClick={() => navigate("/ListaFuncionario")}>
                            Ver funcionarios
                        </button>
                    </div>

                    {loading && <div style={{ padding: 16 }}>Cargando…</div>}
                    {error && <div style={{ padding: 16, color: "#b00020" }}>{error}</div>}
                    {!loading && !error && (
                        <>
                            <section className="perfil-admin-card">
                                <div className="perfil-admin-left">
                                    <div className="perfil-admin-avatar">
                                        <img src={perfil} alt="avatar" className="perfil-admin-conf" />
                                    </div>
                                    <div className="perfil-admin-details">
                                        <p><span className="label">Nombre(s):</span> {fmt(nombre)}</p>
                                        <p><span className="label">Apellido(s):</span> {fmt(apellido)}</p>
                                        <p><span className="label">RUN:</span> {fmt(fun?.rut)}</p>
                                        <p><span className="label">Género:</span> {fmt(genero)}</p>
                                        <p><span className="label">Cargo:</span> {fmt(cargo)}</p>
                                    </div>
                                </div>
                                <div className="perfil-admin-right">
                                    <p><span className="label">Dirección:</span> {fmt(direccion)}</p>
                                    <p><span className="label">Email:</span> {fmt(email)}</p>
                                    <p><span className="label">Teléfono:</span> {fmt(telefono)}</p>
                                    <p><span className="label">Fecha de nacimiento:</span> {fmt(nacimiento)}</p>
                                </div>
                            </section>

                            <section className="perfil-admin-contract">
                                <div className="admin-contract-left">
                                    <p><strong>Tipo de contrato:</strong> {fmt(tipoContrato)}</p>
                                    <p><strong>Fecha inicio:</strong> {fmt(inicio)}</p>
                                    <p><strong>Fecha término:</strong> {fmt(termino)}</p>
                                    <p><strong>Bonos:</strong> {money(bonos)}</p>
                                    <p><strong>Tipos de Bonos:</strong> {fmt(tiposBonos)}</p>
                                </div>
                                <aside className="admin-contract-box">
                                    <p><strong>Sueldo Bruto:</strong> {money(sueldoBruto)}</p>
                                    <p><strong>Sueldo Líquido:</strong> {money(sueldoLiquido)}</p>
                                    <p><strong>Bonos:</strong> {money(bonos)}</p>
                                    <hr />
                                    <p><strong>Total:</strong> {money(total)}</p>
                                    <p><strong>Fecha de pago:</strong> {fmt(fechaPago)}</p>
                                </aside>
                            </section>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}