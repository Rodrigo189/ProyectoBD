import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdministradorDashboard from "../components/dashtemp";

export default function AdminDashPage() {
    const navigate = useNavigate();
    const { id } = useParams(); // si hay :id, estamos dentro de un usuario

    return (
        <AdministradorDashboard
            showFuncionariosButton={!id} // solo en el dashboard raíz del admin
            onShowFuncionarios={() => navigate("/ListaFuncionarioRyE")}
        // forceId opcional
        />
    );
}