import React from "react";
import FuncionarioDashboard from "../components/dashtemp";

export default function FundashPage() {
    // sin filepath (copia este snippet al inicio del componente de la página protegida)
    const role = localStorage.getItem("currentUserRole");
    if (role !== "funcionario") return <div style={{ padding: 16 }}>No autorizado: requiere rol funcionario.</div>; // para páginas de funcionarios
    // usa el usuario actual como id por defecto (mock)
    const currentUserId = window.localStorage.getItem("currentUserId") || null;
    return <FuncionarioDashboard forceId={currentUserId} />;
}