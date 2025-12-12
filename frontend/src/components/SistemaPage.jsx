import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import { useToast } from "./Toast";
import "../styles/sistema.css";
import { fetchSisByRut, updateSistema } from "./funcionariosApi";

export default function SisTemplate() {
    const navigate = useNavigate();
    const { id: routeId } = useParams();
    const userId = routeId || window.localStorage.getItem("currentUserId") || null;
    const currentUserRut = localStorage.getItem("currentUserId") || "";
    const currentUserRole = localStorage.getItem("currentUserRole") || "";

    const isOwnProfile = userId === currentUserRut;
    const canEdit = currentUserRole === "admin" && !isOwnProfile;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({});
    const [saving, setSaving] = useState(false);

    // Toast para notificaciones
    const { showToast, ToastComponent } = useToast();

    useEffect(() => {
        let mounted = true;
        if (!userId) {
            setData(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        fetchSisByRut(userId)
            .then((res) => {
                if (mounted) {
                    console.log("Datos recibidos:", res);
                    setData(res || {});
                    setEditData(res || {});
                }
            })
            .catch(err => {
                console.error("Error al cargar datos:", err);
                if (mounted) {
                    setData({});
                    setEditData({});
                }
            })
            .finally(() => mounted && setLoading(false));

        return () => { mounted = false; };
    }, [userId]);

    const handleFieldChange = (field, value) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateSistema(userId, editData);
            setData(editData);
            setEditMode(false);
            showToast("Datos guardados correctamente", "success");
        } catch (e) {
            console.error("Error al guardar:", e);
            showToast("Error al guardar los datos", "error");
        } finally {
            setSaving(false);
        }
    };

    const displayData = editMode ? editData : data;

    return (
        <div className="sis-bg">
            <Header onBack={() => navigate(-1)} title="Sistema" />
            <ToastComponent />
            <main className="sis-main">
                <h1 className="sis-heading">Información del Sistema</h1>

                {canEdit && (
                    <div className="sis-edit-controls">
                        {!editMode ? (
                            <button className="sis-btn sis-btn-edit" onClick={() => setEditMode(true)}>
                                ✏️ Editar Sistema
                            </button>
                        ) : (
                            <>
                                <button className="sis-btn sis-btn-save" onClick={handleSave} disabled={saving}>
                                    {saving ? "Guardando..." : "💾 Guardar"}
                                </button>
                                <button className="sis-btn sis-btn-cancel" onClick={() => {
                                    setEditMode(false);
                                    setEditData(data);
                                }}>
                                    ❌ Cancelar
                                </button>
                            </>
                        )}
                    </div>
                )}

                {loading ? (
                    <p className="loading">Cargando...</p>
                ) : !displayData ? (
                    <p style={{ padding: 16 }}>Sin datos disponibles.</p>
                ) : (
                    <section className="sis-grid">
                        <div className="sis-card">
                            <div className="sis-label">Horas Trabajadas</div>
                            {editMode ? (
                                <input
                                    type="number"
                                    value={displayData.horas || 0}
                                    onChange={(e) => handleFieldChange("horas", Number(e.target.value))}
                                />
                            ) : (
                                <div className="sis-value">{displayData.horas || 0}</div>
                            )}
                        </div>

                        <div className="sis-card">
                            <div className="sis-label">Horas Extra</div>
                            {editMode ? (
                                <input
                                    type="number"
                                    value={displayData.extra || 0}
                                    onChange={(e) => handleFieldChange("extra", Number(e.target.value))}
                                />
                            ) : (
                                <div className="sis-value teal">{displayData.extra || 0}</div>
                            )}
                        </div>

                        <div className="sis-card">
                            <div className="sis-label">Ausencias</div>
                            {editMode ? (
                                <input
                                    type="number"
                                    value={displayData.ausencias || 0}
                                    onChange={(e) => handleFieldChange("ausencias", Number(e.target.value))}
                                />
                            ) : (
                                <div className="sis-value">{displayData.ausencias || 0}</div>
                            )}
                        </div>

                        <div className="sis-card">
                            <div className="sis-label">Días de Vacaciones</div>
                            {editMode ? (
                                <input
                                    type="number"
                                    value={displayData.vacaciones || 0}
                                    onChange={(e) => handleFieldChange("vacaciones", Number(e.target.value))}
                                />
                            ) : (
                                <div className="sis-value">{displayData.vacaciones || 0}</div>
                            )}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
}