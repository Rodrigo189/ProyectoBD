import React from "react";
import DashboardTemplate from "./DashboardTemplate";

export default function FundashPage() {
    // sin filepath (copia este snippet al inicio del componente de la página protegida)
    const role = localStorage.getItem("currentUserRole");
    if (role !== "funcionario") return <div style={{ padding: 16 }}>No autorizado: requiere rol funcionario.</div>; // para páginas de funcionarios
    // usa el usuario actual como id por defecto (mock)
    const currentUserId = window.localStorage.getItem("currentUserId") || null;
    return <DashboardTemplate forceId={currentUserId} />;
}