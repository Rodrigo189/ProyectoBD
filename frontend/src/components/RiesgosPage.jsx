import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import { useToast } from "./Toast";
import "../styles/riesgos.css";
import { fetchRiesgosByUser, fetchFuncionarioById, updateRiesgos } from "./funcionariosApi";

const levelClass = (nivel) => {
    const n = String(nivel || "").toLowerCase();
    if (n.includes("alto")) return "red";
    if (n.includes("medio")) return "yellow";
    return "green";
};

const getAge = (dob) => {
    if (!dob) return "—";
    const d = new Date(dob);
    if (Number.isNaN(d.getTime())) return "—";
    const diff = Date.now() - d.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// Datos personales únicos por usuario
const datosPersonales = {
    "11111111-1": { peso: "65KG", alergias: "Ninguna conocida" },
    "22222222-2": { peso: "78KG", alergias: "Ibuprofeno" },
    "33333333-3": { peso: "70KG", alergias: "Penicilina" },
    "44444444-4": { peso: "82KG", alergias: "Látex" }
};

// Recomendaciones únicas por usuario
const recomendacionesPorUsuario = {
    "11111111-1": [
        "Realizar pausas activas cada 2 horas",
        "Uso obligatorio de faja lumbar en movilizaciones",
        "Actualizar registros diariamente",
        "Capacitación en manejo de cargas"
    ],
    "22222222-2": [
        "Revisar stock de EPP semanalmente",
        "Protocolo de primeros auxilios actualizado",
        "Ejercicios de estiramiento cada turno",
        "Evitar exposición prolongada sin protección"
    ],
    "33333333-3": [
        "Técnicas de movilización segura obligatorias",
        "Apoyo psicológico mensual disponible",
        "Completar protocolos antes de turno",
        "Uso de barreras de protección en todo momento"
    ],
    "44444444-4": [
        "Priorizar documentación pendiente",
        "Programar auditoría para próximo mes",
        "Revisar procesos administrativos",
        "Actualizar sistema de gestión"
    ]
};

export default function RiskTemplate() {
    const navigate = useNavigate();
    const { id: routeId } = useParams();
    const userId = routeId || window.localStorage.getItem("currentUserId") || null;
    const currentUserRut = localStorage.getItem("currentUserId") || "";
    const currentUserRole = localStorage.getItem("currentUserRole") || "";

    const isOwnProfile = userId === currentUserRut;
    const canEdit = currentUserRole === "admin" && !isOwnProfile;

    const [user, setUser] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState([]);
    const [saving, setSaving] = useState(false);
    const [recomendaciones, setRecomendaciones] = useState([]);
    const [editRecomendaciones, setEditRecomendaciones] = useState([]);

    // Toast para notificaciones
    const { showToast, ToastComponent } = useToast();

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        if (!userId) {
            setUser(null);
            setItems([]);
            setLoading(false);
            return;
        }

        // Cargar recomendaciones específicas del usuario
        const recsUsuario = recomendacionesPorUsuario[userId] || [
            "Sin recomendaciones específicas"
        ];
        setRecomendaciones(recsUsuario);

        Promise.all([fetchFuncionarioById(userId), fetchRiesgosByUser(userId)])
            .then(([u, r]) => {
                if (!mounted) return;
                setUser(u || null);
                const risks = Array.isArray(r) ? r : [];
                setItems(risks);
                setEditData(JSON.parse(JSON.stringify(risks)));
            })
            .finally(() => mounted && setLoading(false));

        return () => { mounted = false; };
    }, [userId]);

    const nacimiento = user?.nacimiento || user?.fechaNacimiento || null;
    const edad = getAge(nacimiento);
    const datosUser = datosPersonales[userId] || { peso: "—", alergias: "—" };

    const handleNivelChange = (idx, newNivel) => {
        const updated = [...editData];
        updated[idx].nivel = newNivel;
        setEditData(updated);
    };

    const handleRecomendacionChange = (idx, value) => {
        const updated = [...editRecomendaciones];
        updated[idx] = value;
        setEditRecomendaciones(updated);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateRiesgos(userId, editData);
            setItems(editData);
            setRecomendaciones([...editRecomendaciones]);
            setEditMode(false);
            showToast("Guardado exitosamente", "success");
        } catch (e) {
            console.error("Error al guardar:", e);
            showToast("Error al guardar", "error");
        } finally {
            setSaving(false);
        }
    };

    const displayItems = editMode ? editData : items;
    const displayRecomendaciones = editMode ? editRecomendaciones : recomendaciones;

    return (
        <div className="riesgo-bg">
            <Header onBack={() => navigate(-1)} />
            <ToastComponent />
            <main className="riesgo-main">
                <h1 className="riesgo-title">Análisis de Riesgo</h1>

                {canEdit && (
                    <div className="riesgo-edit-controls">
                        {!editMode ? (
                            <button className="riesgo-btn riesgo-btn-edit" onClick={() => {
                                setEditMode(true);
                                setEditRecomendaciones([...recomendaciones]);
                            }}>
                                ✏️ Editar Riesgos
                            </button>
                        ) : (
                            <>
                                <button className="riesgo-btn riesgo-btn-save" onClick={handleSave} disabled={saving}>
                                    {saving ? "Guardando..." : "💾 Guardar"}
                                </button>
                                <button className="riesgo-btn riesgo-btn-cancel" onClick={() => setEditMode(false)}>
                                    ❌ Cancelar
                                </button>
                            </>
                        )}
                    </div>
                )}

                {loading ? (
                    <p className="loading">Cargando...</p>
                ) : (
                    <section className="riesgo-content">
                        <div className="riesgo-list">
                            {displayItems.map((r, idx) => (
                                <div key={r.id || `${r.tipo}-${r.detalle || ""}-${idx}`} className="riesgo-item">
                                    <div className="r-title">
                                        {r.detalle ? `${r.tipo} + ${r.detalle}` : r.tipo}
                                    </div>
                                    {editMode ? (
                                        <select
                                            value={r.nivel}
                                            onChange={(e) => handleNivelChange(idx, e.target.value)}
                                            className="riesgo-select"
                                        >
                                            <option value="Bajo">Bajo</option>
                                            <option value="Medio">Medio</option>
                                            <option value="Alto">Alto</option>
                                        </select>
                                    ) : (
                                        <span className={`riesgo-pill ${levelClass(r.nivel)}`}>{r.nivel}</span>
                                    )}
                                </div>
                            ))}
                            {displayItems.length === 0 && (
                                <div className="empty">Sin riesgos registrados para este funcionario.</div>
                            )}
                        </div>

                        <div className="right-col">
                            <div className="patient-card">
                                <div><strong>Paciente:</strong> {user ? `${user.nombre} ${user.apellido}` : "—"}</div>
                                <div><strong>Edad:</strong> {edad} años <span className="sep">|</span> <strong>Peso:</strong> {datosUser.peso}</div>
                                <div><strong>Alergias:</strong> {datosUser.alergias}</div>
                            </div>

                            <aside className="recommend-card">
                                <h3>Recomendaciones</h3>
                                {editMode ? (
                                    <div className="recommend-edit">
                                        {editRecomendaciones.map((rec, idx) => (
                                            <div key={idx} className="recommend-item-edit">
                                                <span>•</span>
                                                <input
                                                    type="text"
                                                    value={rec}
                                                    onChange={(e) => handleRecomendacionChange(idx, e.target.value)}
                                                    className="recommend-input"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <ul>
                                        {displayRecomendaciones.map((rec, idx) => (
                                            <li key={idx}>{rec}</li>
                                        ))}
                                    </ul>
                                )}
                            </aside>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}