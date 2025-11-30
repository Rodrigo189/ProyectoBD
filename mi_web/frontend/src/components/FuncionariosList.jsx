import React from "react";
import { useNavigate } from "react-router-dom";
import ListTemplate from "./ListTemplate";
import perfil from "../img/perfil.png";
import { listFuncionarios } from "./funcionariosApi";

const fetchFuncionarios = async () => {
    const list = await listFuncionarios();
    return list.map(f => ({
        id: f.rut,
        nombre: `${f.nombre || ""} ${f.apellido || ""}`.trim(),
        cargo: f.cargo || "",
        email: f.email || "",
        avatar: f.avatar || perfil
    }));
};

export default function ListaFuncionario() {
    const navigate = useNavigate();
    return (
        <ListTemplate
            fetchFuncionarios={fetchFuncionarios}
            onSelect={(f) => navigate(`/funcionarios/${encodeURIComponent(f.id)}`)} // Detalle editable (sub-func)
        />
    );
}