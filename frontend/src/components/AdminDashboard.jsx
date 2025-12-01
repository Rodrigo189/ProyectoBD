import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardTemplate from "./DashboardTemplate";

export default function AdminDashPage() {
    // Hooks SIEMPRE primero
    const navigate = useNavigate();
    const { id } = useParams(); // si hay :id, estamos dentro de un usuario

    // Guard de rol (después de los hooks)
    const role = localStorage.getItem("currentUserRole");
    const notAuthorized = role !== "admin";
    if (notAuthorized) return <div style={{ padding: 16 }}>No autorizado: requiere rol administrador.</div>;

    return (
        <DashboardTemplate
            showFuncionariosButton={!id} // solo en el dashboard raíz del admin
            onShowFuncionarios={() => navigate("/ListaFuncionarioRyE")}
        // forceId opcional
        />
    );
}