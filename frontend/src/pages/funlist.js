import React from "react";
import ListaFuncionarioRyE from "../components/listemplate";
import perfil from "../img/perfil.png";

// Mock actual (igual al que tenías antes)
const fetchFuncionarios = () =>
    Promise.resolve([
        { id: "1", nombre: "Juanito Pérez", cargo: "Jefe de Departamento", email: "juan.perez@eleam.cl", avatar: perfil },
        { id: "2", nombre: "María Gómez", cargo: "Auxiliar", email: "maria.gomez@eleam.cl", avatar: perfil },
        { id: "3", nombre: "Carlos Ruiz", cargo: "Enfermero", email: "carlos.ruiz@eleam.cl", avatar: perfil },
        { id: "4", nombre: "Ana Torres", cargo: "Médico", email: "ana.torres@eleam.cl", avatar: perfil },
        { id: "5", nombre: "Laura Díaz", cargo: "Enfermera", email: "laura.diaz@eleam.cl", avatar: perfil },
        { id: "6", nombre: "Pedro Soto", cargo: "Auxiliar", email: "pedro.soto@eleam.cl", avatar: perfil },
        { id: "7", nombre: "Sofía Reyes", cargo: "Médico", email: "sofia.reyes@eleam.cl", avatar: perfil },
        { id: "8", nombre: "Miguel Lara", cargo: "Enfermero", email: "miguel.lara@eleam.cl", avatar: perfil },
    ]);

export default function ListaFuncionario() {
    return (
        <ListaFuncionarioRyE
            // title="Funcionarios"
            fetchFuncionarios={fetchFuncionarios}
        // onSelect se omite: navega a /funcionarios/:id por defecto
        />
    );
}