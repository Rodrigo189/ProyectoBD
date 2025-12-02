import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import "../styles/funcionarioProfile.css";
import perfilDefault from "../img/perfil.png";
import { fetchFuncionarioById, updateRemuneracion } from "./funcionariosApi";

const money = (n) =>
    Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 })
        .format(Number(n || 0));
const fmt = (v, d = "—") => (v === 0 ? "0" : (v ?? d));

export default function PerfilFuncionarioDetail() {
    const { id } = useParams(); // rut
    const navigate = useNavigate();
    const currentUserRut = localStorage.getItem("currentUserId") || "";

    const [data, setData] = useState(null);
    const [form, setForm] = useState({ sueldoBruto: "", sueldoLiquido: "", bonos: "" });
    const [loading, setLoading] = useState(true);
    const [edit, setEdit] = useState(false);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState("");

    // Detectar si es el propio perfil (no puede editar su sueldo)
    const isOwnProfile = data?.rut === currentUserRut;

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const f = await fetchFuncionarioById(id);
                if (!alive) return;
                setData(f);
                setForm({
                    sueldoBruto: f?.sueldoBruto ?? "",
                    sueldoLiquido: f?.sueldoLiquido ?? "",
                    bonos: f?.bonos ?? "",
                });
            } catch {
                if (alive) setData(null);
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [id]);

    const onChange = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

    const onSave = async () => {
        setSaving(true);
        setMsg("");
        try {
            const payload = {
                sueldoBruto: Number(form.sueldoBruto) || 0,
                sueldoLiquido: Number(form.sueldoLiquido) || 0,
                bonos: Number(form.bonos) || 0,
            };
            const res = await updateRemuneracion(id, payload);
            if (!res.ok) throw res.data;
            setData((d) => ({ ...d, ...payload }));
            setEdit(false);
            setMsg("Cambios guardados.");
            setTimeout(() => setMsg(""), 2500);
        } catch (e) {
            setMsg("No se pudo guardar. Revisa la consola.");
            console.error("updateRemuneracion error:", e);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="perfil-bg">
                <Header />
                <main className="perfil-main"><div className="perfil-frame"><p>Cargando…</p></div></main>
            </div>
        );
    }
    if (!data) {
        return (
            <div className="perfil-bg">
                <Header onBack={() => navigate(-1)} />
                <main className="perfil-main"><div className="perfil-frame"><p>Funcionario no encontrado</p></div></main>
            </div>
        );
    }

    const total = (Number(edit ? form.sueldoLiquido : data.sueldoLiquido) || 0) +
        (Number(edit ? form.bonos : data.bonos) || 0);

    return (
        <div className="perfil-bg">
            <Header onBack={() => navigate(-1)} />
            <main className="perfil-main">
                <div className="perfil-frame">
                    {msg && <div style={{ marginBottom: 8, color: "#0a6" }}>{msg}</div>}

                    <section className="perfil-card">
                        <div className="perfil-left">
                            <div className="perfil-avatar" aria-hidden="true">
                                <img src={data.avatar || perfilDefault} alt="Perfil" className="perfil-conf" />
                            </div>
                            <div className="perfil-details">
                                <p><span className="label">Nombre(s):</span> {fmt(data.nombre)}</p>
                                <p><span className="label">Apellido(s):</span> {fmt(data.apellido)}</p>
                                <p><span className="label">RUN:</span> {fmt(data.rut)}</p>
                                <p><span className="label">Género:</span> {fmt(data.genero)}</p>
                                <p><span className="label">Cargo:</span> {fmt(data.cargo)}</p>
                            </div>
                        </div>
                        <div className="perfil-right">
                            <p><span className="label">Dirección:</span> {fmt(data.direccion)}</p>
                            <p><span className="label">Email:</span> {fmt(data.email)}</p>
                            <p><span className="label">Teléfono:</span> {fmt(data.telefono)}</p>
                            <p><span className="label">Fecha de nacimiento:</span> {fmt(data.nacimiento)}</p>
                        </div>
                    </section>

                    <section className="perfil-contract">
                        <div className="contract-left">
                            <p><strong>Tipo de contrato:</strong> {fmt(data.tipoContrato)}</p>
                            <p><strong>Fecha inicio:</strong> {fmt(data.inicioContrato || data.inicio)}</p>
                            <p><strong>Fecha término:</strong> {fmt(data.terminoContrato || data.termino)}</p>
                            <p><strong>Bonos:</strong> {money(data.bonos)}</p>
                            <p><strong>Tipos de Bonos:</strong> {fmt(data.tiposBonos)}</p>
                        </div>

                        <aside className="contract-box">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                <strong>Sueldo y Bonos</strong>
                                {!edit ? (
                                    <button
                                        className="perfil-btn"
                                        onClick={() => setEdit(true)}
                                        disabled={isOwnProfile}
                                        title={isOwnProfile ? "No puedes editar tu propio sueldo" : "Editar"}
                                        style={{ opacity: isOwnProfile ? 0.5 : 1, cursor: isOwnProfile ? "not-allowed" : "pointer" }}
                                    >
                                        Editar
                                    </button>
                                ) : (
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <button className="perfil-btn" onClick={() => {
                                            setEdit(false); setForm({
                                                sueldoBruto: data.sueldoBruto ?? "",
                                                sueldoLiquido: data.sueldoLiquido ?? "",
                                                bonos: data.bonos ?? "",
                                            });
                                        }}>Cancelar</button>
                                        <button className="perfil-btn primary" onClick={onSave} disabled={saving}>
                                            {saving ? "Guardando..." : "Guardar"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div style={{ marginBottom: 8 }}>
                                <label style={{ display: "block", fontWeight: 700 }}>Sueldo Bruto:</label>
                                {edit && !isOwnProfile ? (
                                    <input type="number" value={form.sueldoBruto} onChange={onChange("sueldoBruto")} className="contract-input" />
                                ) : (
                                    <div className="contract-value">{money(data.sueldoBruto)}</div>
                                )}
                            </div>

                            <div style={{ marginBottom: 8 }}>
                                <label style={{ display: "block", fontWeight: 700 }}>Sueldo Líquido:</label>
                                {edit && !isOwnProfile ? (
                                    <input type="number" value={form.sueldoLiquido} onChange={onChange("sueldoLiquido")} className="contract-input" />
                                ) : (
                                    <div className="contract-value">{money(data.sueldoLiquido)}</div>
                                )}
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                <label style={{ display: "block", fontWeight: 700 }}>Bonos:</label>
                                {edit && !isOwnProfile ? (
                                    <input type="number" value={form.bonos} onChange={onChange("bonos")} className="contract-input" />
                                ) : (
                                    <div className="contract-value">{money(data.bonos)}</div>
                                )}
                            </div>

                            <hr style={{ border: "none", borderTop: "1px solid rgba(0,0,0,0.12)", margin: "8px 0" }} />

                            <div style={{ marginTop: 6 }}>
                                <p style={{ fontWeight: 800, margin: "6px 0" }}>Total: {money(total)}</p>
                                <p style={{ margin: "4px 0", color: "rgba(0,0,0,0.6)" }}>Fecha de pago: {fmt(data.fechaPago)}</p>
                            </div>
                        </aside>
                    </section>
                </div>
            </main>
        </div>
    );
}