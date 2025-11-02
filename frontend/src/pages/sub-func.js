import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/header";
import "../style/perf-fun.css";
import { fetchFuncionarioById, updateRemuneracion } from "../api/funcionarios";
import perfilDefault from "../img/perfil.png";

function computeLiquidoFromBruto(bruto, rates = { afp: 0.11, salud: 0.07, cesantia: 0.006 }) {
    const b = Number(bruto) || 0;
    const descuento = b * (rates.afp + rates.salud + rates.cesantia);
    const liquido = Math.round(b - descuento);
    return { liquido, descuento };
}

export default function PerfilFuncionarioDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [form, setForm] = useState({ sueldoBruto: "", sueldoLiquido: "", bonos: "" });
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        let mounted = true;
        fetchFuncionarioById(id)
            .then((f) => {
                if (!mounted) return;
                if (!f) {
                    setData(null);
                    setLoading(false);
                    return;
                }
                setData(f);
                setForm({
                    sueldoBruto: f.sueldoBruto ?? "",
                    sueldoLiquido: f.sueldoLiquido ?? "",
                    bonos: f.bonos ?? "",
                });
                setLoading(false);
            })
            .catch(() => {
                if (mounted) setLoading(false);
            });
        return () => (mounted = false);
    }, [id]);

    const handleChange = (field) => (e) => setForm((s) => ({ ...s, [field]: e.target.value }));

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                sueldoBruto: Number(form.sueldoBruto) || 0,
                sueldoLiquido: Number(form.sueldoLiquido) || 0,
                bonos: Number(form.bonos) || 0,
            };
            const res = await updateRemuneracion(id, payload);
            if (res.ok) {
                setData((d) => ({ ...d, ...payload }));
                setEditMode(false);
            } else {
                console.error("Error al guardar");
            }
        } finally {
            setSaving(false);
        }
    };

    // dentro del componente, reemplaza el cálculo anterior del total por:
    const currentSueldoBruto = Number(editMode ? form.sueldoBruto : data?.sueldoBruto || 0);
    const { liquido: derivedSueldoLiquido } = computeLiquidoFromBruto(currentSueldoBruto);
    // si en editMode se editan directamente los campos de líquido, puedes priorizar form.sueldoLiquido:
    const currentSueldoLiquido = editMode && form.sueldoLiquido !== "" ? Number(form.sueldoLiquido) : derivedSueldoLiquido;
    const currentBonos = Number(editMode ? form.bonos : data?.bonos || 0);
    const total = currentSueldoLiquido + currentBonos;

    if (loading)
        return (
            <div className="perfil-bg">
                <Header />
                <main className="perfil-main">
                    <div className="perfil-frame">
                        <p>Cargando...</p>
                    </div>
                </main>
            </div>
        );

    if (!data)
        return (
            <div className="perfil-bg">
                <Header onBack={() => navigate(-1)} />
                <main className="perfil-main">
                    <div className="perfil-frame">
                        <p>Funcionario no encontrado</p>
                    </div>
                </main>
            </div>
        );

    return (
        <div className="perfil-bg">
            <Header onBack={() => navigate(-1)} />
            <main className="perfil-main">
                <div className="perfil-frame">
                    <section className="perfil-card">
                        <div className="perfil-left">
                            <div className="perfil-avatar" aria-hidden="true">
                                <img src={data.avatar || perfilDefault} alt="Perfil" className="perfil-conf" />
                            </div>

                            <div className="perfil-details">
                                <p>
                                    <span className="label">Nombre(s):</span> {data.nombre}
                                </p>
                                <p>
                                    <span className="label">Apellido(s):</span> {data.apellido}
                                </p>
                                <p>
                                    <span className="label">RUN:</span> {data.run}
                                </p>
                                <p>
                                    <span className="label">Género:</span> {data.genero}
                                </p>
                                <p>
                                    <span className="label">Cargo:</span> {data.cargo ?? "-"}
                                </p>
                            </div>
                        </div>

                        <div className="perfil-right">
                            <p>
                                <span className="label">Dirección:</span> {data.direccion}
                            </p>
                            <p>
                                <span className="label">Email:</span> {data.email}
                            </p>
                            <p>
                                <span className="label">Teléfono:</span> {data.telefono}
                            </p>
                            <p>
                                <span className="label">Fecha de nacimiento:</span> {data.nacimiento ?? "-"}
                            </p>
                        </div>
                    </section>

                    <section className="perfil-contract">
                        <div className="contract-left">
                            <p>
                                <strong>Tipo de contrato:</strong> {data.tipoContrato}
                            </p>
                            <p>
                                <strong>Fecha inicio:</strong> {data.inicio}
                            </p>
                            <p>
                                <strong>Fecha término:</strong> {data.termino}
                            </p>
                            <p>
                                <strong>Bonos:</strong> {data.bonos}
                            </p>
                            <p>
                                <strong>Tipos de Bonos:</strong> {data.tiposBonos ?? "-"}
                            </p>
                        </div>

                        <aside className="contract-box">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                                <strong>Sueldo y Bonos</strong>
                                <div style={{ display: "flex", gap: 8 }}>
                                    {!editMode ? (
                                        <button className="perfil-btn" onClick={() => setEditMode(true)}>
                                            Editar
                                        </button>
                                    ) : (
                                        <>
                                            <button className="perfil-btn" onClick={() => setEditMode(false)} disabled={saving}>
                                                Cancelar
                                            </button>
                                            <button className="perfil-btn primary" onClick={handleSave} disabled={saving}>
                                                {saving ? "Guardando..." : "Guardar"}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div style={{ marginBottom: 8 }}>
                                <label style={{ display: "block", fontWeight: 700 }}>Sueldo Bruto:</label>
                                {editMode ? (
                                    <input type="number" value={form.sueldoBruto} onChange={handleChange("sueldoBruto")} className="contract-input" />
                                ) : (
                                    <div className="contract-value">{data.sueldoBruto}</div>
                                )}
                            </div>

                            <div style={{ marginBottom: 8 }}>
                                <label style={{ display: "block", fontWeight: 700 }}>Sueldo Líquido:</label>
                                {editMode ? (
                                    <input type="number" value={form.sueldoLiquido} onChange={handleChange("sueldoLiquido")} className="contract-input" />
                                ) : (
                                    <div className="contract-value">{data.sueldoLiquido}</div>
                                )}
                            </div>

                            <div style={{ marginBottom: 12 }}>
                                <label style={{ display: "block", fontWeight: 700 }}>Bonos:</label>
                                {editMode ? (
                                    <input type="number" value={form.bonos} onChange={handleChange("bonos")} className="contract-input" />
                                ) : (
                                    <div className="contract-value">{data.bonos}</div>
                                )}
                            </div>

                            <hr style={{ border: "none", borderTop: "1px solid rgba(0,0,0,0.12)", margin: "8px 0" }} />

                            <div style={{ marginTop: 6 }}>
                                <p style={{ fontWeight: 800, margin: "6px 0" }}>Total: {total.toLocaleString()}</p>
                                <p style={{ margin: "4px 0", color: "rgba(0,0,0,0.6)" }}>Fecha de pago: {data.fechaPago}</p>
                            </div>
                        </aside>
                    </section>
                </div>
            </main>
        </div>
    );
}