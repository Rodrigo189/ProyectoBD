import React from "react";
import { useNavigate } from "react-router-dom";
import ListaFuncionarioRyE from "../components/listemplate";
import perfil from "../img/perfil.png";
import { listFuncionarios } from "../api/funcionarios";

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
        <ListaFuncionarioRyE
            fetchFuncionarios={fetchFuncionarios}
            onSelect={(f) => navigate(`/funcionarios/${encodeURIComponent(f.id)}`)} // Detalle editable (sub-func)
        />
    );
}