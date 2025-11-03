import React from "react";
import { useNavigate } from "react-router-dom";
import ListaFuncionarioRyE from "../components/listemplate";
import perfil from "../img/perfil.png";

// De momento usa el mismo mock; luego lo cambiamos a tu lógica nueva
const mockFetchFuncionarios = () =>
    Promise.resolve([
        { id: "1", nombre: "Juanito Pérez", cargo: "Jefe de Departamento", email: "juan.perez@eleam.cl", avatar: perfil },
        { id: "2", nombre: "María Gómez", cargo: "Auxiliar", email: "maria.gomez@eleam.cl", avatar: perfil },
        { id: "3", nombre: "Carlos Ruiz", cargo: "Enfermero", email: "carlos.ruiz@eleam.cl", avatar: perfil },
        { id: "4", nombre: "Ana Torres", cargo: "Médico", email: "ana.torres@eleam.cl", avatar: perfil },
    ]);

export default function ListaFuncionarioLyE() {
    const navigate = useNavigate();

    return (
        <ListaFuncionarioRyE
            // title="Funcionarios" // mismo título que la original
            fetchFuncionarios={mockFetchFuncionarios}
            onSelect={(f) => {
                // TODO: aquí va la navegación/lógica específica de Reportes y Estadísticas
                // Ejemplo provisional (cámbialo cuando me pases la lógica):
                navigate(`/AdministradorDashboard/${f.id}`);
            }}
        />
    );
}