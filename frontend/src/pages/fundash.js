import React from "react";
import FuncionarioDashboard from "../components/dashtemp";

export default function FundashPage() {
    // usa el usuario actual como id por defecto (mock)
    const currentUserId = window.localStorage.getItem("currentUserId") || null;
    return <FuncionarioDashboard forceId={currentUserId} />;
}