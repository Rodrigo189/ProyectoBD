import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import "../styles/probabilidades.css";
import { fetchProbabilidadesMedicamentosByUser, updateProbabilidades } from "./funcionariosApi";

export default function ProbTemplate() {
    const navigate = useNavigate();
    const { id: routeId } = useParams();
    const userId = routeId || window.localStorage.getItem("currentUserId") || null;
    const currentUserRut = localStorage.getItem("currentUserId") || "";
    const currentUserRole = localStorage.getItem("currentUserRole") || "";

    const isOwnProfile = userId === currentUserRut;
    const canEdit = currentUserRole === "admin" && !isOwnProfile;

    const [items, setItems] = useState([]);
    const [cat, setCat] = useState("Todos");
    const [loading, setLoading] = useState(true);
    const [gridKey, setGridKey] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});
    const [saving, setSaving] = useState(false);

    const normalize = (rows) => {
        const raw = Array.isArray(rows)
            ? rows
            : Array.isArray(rows?.medicamentos)
                ? rows.medicamentos
                : [];
        return raw.map((m, i) => ({
            id: m.id ?? `${m.nombre || "med"}-${i}`,
            nombre: m.nombre || m.name || "—",
            grupo: m.grupo || m.category || "Otros",
            pct: Number(m.pct ?? m.porcentaje ?? m.percent ?? 0),
        }));
    };

    useEffect(() => {
        let mounted = true;
        if (!userId) { setItems([]); setLoading(false); return; }
        setLoading(true);
        fetchProbabilidadesMedicamentosByUser(userId)
            .then((rows) => {
                if (mounted) {
                    const normalized = normalize(rows);
                    setItems(normalized);
                    const initEdit = {};
                    normalized.forEach(m => { initEdit[m.id] = m.pct; });
                    setEditData(initEdit);
                }
            })
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, [userId]);

    useEffect(() => { setGridKey((k) => k + 1); }, [cat]);

    const categories = useMemo(() => ["Todos", ...Array.from(new Set(items.map(x => x.grupo)))], [items]);

    const data = useMemo(() => {
        if (cat === "Todos") return items;
        return items.filter((x) => x.grupo === cat);
    }, [items, cat]);

    const handlePctChange = (id, value) => {
        const num = Math.min(100, Math.max(0, Number(value) || 0));
        setEditData(prev => ({ ...prev, [id]: num }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const updated = items.map(m => ({ ...m, pct: editData[m.id] }));
            await updateProbabilidades(userId, updated);
            setItems(updated);
            setEditMode(false);
            alert("Guardado exitosamente");
        } catch (e) {
            console.error("Error al guardar:", e);
            alert("Error al guardar");
        } finally {
            setSaving(false);
        }
    };

    function getGradientColor(pct) {
        let r, g, b;
        if (pct <= 50) {
            r = 255;
            g = Math.round(72 + (221 - 72) * (pct / 50));
            b = Math.round(72 + (51 - 72) * (pct / 50));
        } else {
            r = Math.round(255 - (255 - 72) * ((pct - 50) / 50));
            g = Math.round(221 + (199 - 221) * ((pct - 50) / 50));
            b = Math.round(51 + (72 - 51) * ((pct - 50) / 50));
        }
        return `rgb(${r},${g},${b})`;
    }

    return (
        <div className="prob-bg">
            <Header onBack={() => navigate(-1)} title="Probabilidades de medicamentos" />
            <main className="prob-main">
                <h1 className="prob-title">Análisis de Interacciones</h1>
                <h1 className="prob-subtitle">Cantidad de Medicamentos</h1>

                {canEdit && (
                    <div className="prob-edit-controls">
                        {!editMode ? (
                            <button className="prob-btn prob-btn-edit" onClick={() => setEditMode(true)}>
                                ✏️ Editar
                            </button>
                        ) : (
                            <>
                                <button className="prob-btn prob-btn-save" onClick={handleSave} disabled={saving}>
                                    {saving ? "Guardando..." : "💾 Guardar"}
                                </button>
                                <button className="prob-btn prob-btn-cancel" onClick={() => {
                                    setEditMode(false);
                                    const initEdit = {};
                                    items.forEach(m => { initEdit[m.id] = m.pct; });
                                    setEditData(initEdit);
                                }}>
                                    ❌ Cancelar
                                </button>
                            </>
                        )}
                    </div>
                )}

                <nav className="prob-filter">
                    {categories.map((c) => (
                        <button
                            key={c}
                            className={`prob-pill ${c === cat ? "active" : ""}`}
                            onClick={() => setCat(c)}
                        >
                            {c}
                        </button>
                    ))}
                </nav>

                {(!userId && <p style={{ padding: 8 }}>Selecciona un funcionario.</p>) ||
                    (loading ? <p className="loading">Cargando...</p> :
                        <section key={gridKey} className="prob-grid fade-in">
                            {data.map((m) => {
                                const displayPct = editMode ? editData[m.id] : m.pct;
                                return (
                                    <article key={m.id} className="prob-item">
                                        <div className="avatar">{(m.nombre || "?").charAt(0).toUpperCase()}</div>
                                        <div className="meta">
                                            <div className="name">{m.nombre}</div>
                                            <div className="group">{m.grupo}</div>
                                        </div>
                                        <div className="cuantity">Cantidad</div>
                                        <div className="progress-row">
                                            <div className="bar">
                                                <div className="fill" style={{ width: `${displayPct}%`, background: getGradientColor(displayPct) }} />
                                            </div>
                                            {editMode ? (
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={editData[m.id]}
                                                    onChange={(e) => handlePctChange(m.id, e.target.value)}
                                                    className="prob-input-edit"
                                                />
                                            ) : (
                                                <div className="pct">{displayPct}/100</div>
                                            )}
                                        </div>
                                    </article>
                                );
                            })}
                            {data.length === 0 && (
                                <div className="prob-empty">Sin medicamentos en esta categoría.</div>
                            )}
                        </section>
                    )}
            </main>
        </div>
    );
}