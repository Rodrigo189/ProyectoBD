/* eslint-disable eqeqeq */
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Breadcrumbs.css";

// Breadcrumbs viejos importados de la implementación antigua

let hierarchy;
hierarchy = {
    "/": ["/"],
    "/LoginSelectionLyP": ["/", "/LoginSelectionLyP"],
    "/LoginPyLAdministrador": ["/", "/LoginSelectionLyP", "/LoginPyLAdministrador"],
    "/LoginPyLFuncionario": ["/", "/LoginSelectionLyP", "/LoginPyLFuncionario"],
    "/PerfilAdministrador": ["/", "/LoginSelectionLyP", "/LoginPyLAdministrador", "/PerfilAdministrador"],
    "/PerfilFuncionario": ["/", "/LoginSelectionLyP", "/LoginPyLFuncionario", "/PerfilFuncionario"],
    "/ListaFuncionario": ["/", "/LoginSelectionLyP", "/LoginPyLAdministrador", "/PerfilAdministrador", "/ListaFuncionario"],
    "/funcionarios/:id": ["/", "/LoginSelectionLyP", "/LoginPyLAdministrador", "/PerfilAdministrador", "/ListaFuncionario", "/funcionarios/:id"],

    "/LoginSelectionRyE": ["/", "/LoginSelectionRyE"],
    "/LoginRyEAdministrador": ["/", "/LoginSelectionRyE", "/LoginRyEAdministrador"],
    "/LoginRyEFuncionario": ["/", "/LoginSelectionRyE", "/LoginRyEFuncionario"],
    "/AdministradorDashboard": ["/", "/LoginSelectionRyE", "/LoginRyEAdministrador", "/AdministradorDashboard"],
    "/AdministradorDashboard/:id": ["/", "/LoginSelectionRyE", "/LoginRyEAdministrador", "/AdministradorDashboard", "/ListaFuncionarioRyE", "/AdministradorDashboard/:id"],
    "/FuncionarioDashboard": ["/", "/LoginSelectionRyE", "/LoginRyEFuncionario", "/FuncionarioDashboard"],
    "/ListaFuncionarioRyE": ["/", "/LoginSelectionRyE", "/LoginRyEAdministrador", "/AdministradorDashboard", "/ListaFuncionarioRyE"],
}
// Jerarquía ajustada para rutas con y sin id

const aliases = {
    "/": "Inicio",
    "/LoginSelectionLyP": "Pagos y Liquidaciones",
    "/LoginSelectionRyE": "Reportes y Estadísticas",
    "/LoginPyLAdministrador": "Login Administrador Pagos",
    "/LoginPyLFuncionario": "Login Funcionario Pagos",
    "/LoginRyEAdministrador": "Login Administrador Reportes",
    "/LoginRyEFuncionario": "Login Funcionario Reportes",
    "/PerfilAdministrador": "Perfil Administrador",
    "/PerfilFuncionario": "Perfil Funcionario",
    "/ListaFuncionario": "Lista de Funcionarios",
    "/ListaFuncionarioRyE": "Lista Funcionarios Reportes",
    "/AdministradorDashboard": "Panel Administrador",
    "/AdministradorDashboard/:id": "Detalle Funcionario",
    "/FuncionarioDashboard": "Panel Funcionario",
    "/Estadisticas": "Estadísticas",
    "/Estadisticas/:id": "Estadísticas",
    "/EstadisticasSistema": "Estadísticas del Sistema",
    "/EstadisticasSistema/:id": "Detalles del Sistema",
    "/AnalisisRiesgo": "Análisis de Riesgo",
    "/AnalisisRiesgo/:id": "Detalles de Riesgo",
    "/Probabilidades": "Probabilidades de Medicamentos",
    "/Probabilidades/:id": "Detalles de Probabilidades",
    "/funcionarios": "Funcionarios",
    "/funcionarios/:id": "Detalle Funcionario",
    "/admin": "Administrador",
    "/admin/:id": "Detalle Administrador",
};

function getBreadcrumbParts(path) {
    if (localStorage.getItem("currentUserRole") === "funcionario") {
        hierarchy = {
            "/": ["/"],
            "/LoginSelectionLyP": ["/", "/LoginSelectionLyP"],
            "/LoginPyLAdministrador": ["/", "/LoginSelectionLyP", "/LoginPyLAdministrador"],
            "/LoginPyLFuncionario": ["/", "/LoginSelectionLyP", "/LoginPyLFuncionario"],
            "/PerfilAdministrador": ["/", "/LoginSelectionLyP", "/LoginPyLAdministrador", "/PerfilAdministrador"],
            "/PerfilFuncionario": ["/", "/LoginSelectionLyP", "/LoginPyLFuncionario", "/PerfilFuncionario"],
            "/ListaFuncionario": ["/", "/LoginSelectionLyP", "/LoginPyLAdministrador", "/PerfilAdministrador", "/ListaFuncionario"],
            "/funcionarios/:id": ["/", "/LoginSelectionLyP", "/LoginPyLAdministrador", "/PerfilAdministrador", "/ListaFuncionario", "/funcionarios/:id"],

            "/LoginSelectionRyE": ["/", "/LoginSelectionRyE"],
            "/LoginRyEAdministrador": ["/", "/LoginSelectionRyE", "/LoginRyEAdministrador"],
            "/LoginRyEFuncionario": ["/", "/LoginSelectionRyE", "/LoginRyEFuncionario"],
            "/AdministradorDashboard": ["/", "/LoginSelectionRyE", "/LoginRyEAdministrador", "/AdministradorDashboard"],
            "/AdministradorDashboard/:id": ["/", "/LoginSelectionRyE", "/LoginRyEAdministrador", "/AdministradorDashboard", "/ListaFuncionarioRyE", "/AdministradorDashboard/:id"],
            "/FuncionarioDashboard": ["/", "/LoginSelectionRyE", "/LoginRyEFuncionario", "/FuncionarioDashboard"],
            "/ListaFuncionarioRyE": ["/", "/LoginSelectionRyE", "/LoginRyEAdministrador", "/AdministradorDashboard", "/ListaFuncionarioRyE"],

            // Estadísticas y reportes 
            "/Estadisticas": ["/", "/LoginSelectionRyE", "/LoginRyEFuncionario", "/FuncionarioDashboard", "/Estadisticas"],
            "/Estadisticas/:id": ["/", "/LoginSelectionRyE", "/LoginRyEFuncionario", "/FuncionarioDashboard", "/Estadisticas/:id"],
            "/Probabilidades": ["/", "/LoginSelectionRyE", "/LoginRyEFuncionario", "/FuncionarioDashboard", "/Estadisticas", "/Probabilidades"],
            "/Probabilidades/:id": ["/", "/LoginSelectionRyE", "/LoginRyEFuncionario", "/FuncionarioDashboard", "/Estadisticas"],
            "/AnalisisRiesgo": ["/", "/LoginSelectionRyE", "/LoginRyEFuncionario", "/FuncionarioDashboard", "/Estadisticas", "/AnalisisRiesgo"],
            "/AnalisisRiesgo/:id": ["/", "/LoginSelectionRyE", "/LoginRyEFuncionario", "/FuncionarioDashboard", "/Estadisticas"],
            "/EstadisticasSistema": ["/", "/LoginSelectionRyE", "/LoginRyEFuncionario", "/FuncionarioDashboard", "/Estadisticas", "/EstadisticasSistema"],
            "/EstadisticasSistema/:id": ["/", "/LoginSelectionRyE", "/LoginRyEFuncionario", "/FuncionarioDashboard", "/Estadisticas"],
        };
    }
    if (localStorage.getItem("currentUserRole") === "admin") {
        hierarchy = {
            "/": ["/"],
            "/LoginSelectionLyP": ["/", "/LoginSelectionLyP"],
            "/LoginPyLAdministrador": ["/", "/LoginSelectionLyP", "/LoginPyLAdministrador"],
            "/LoginPyLFuncionario": ["/", "/LoginSelectionLyP", "/LoginPyLFuncionario"],
            "/PerfilAdministrador": ["/", "/LoginSelectionLyP", "/LoginPyLAdministrador", "/PerfilAdministrador"],
            "/PerfilFuncionario": ["/", "/LoginSelectionLyP", "/LoginPyLFuncionario", "/PerfilFuncionario"],
            "/ListaFuncionario": ["/", "/LoginSelectionLyP", "/LoginPyLAdministrador", "/PerfilAdministrador", "/ListaFuncionario"],
            "/funcionarios/:id": ["/", "/LoginSelectionLyP", "/LoginPyLAdministrador", "/PerfilAdministrador", "/ListaFuncionario", "/funcionarios/:id"],

            "/LoginSelectionRyE": ["/", "/LoginSelectionRyE"],
            "/LoginRyEAdministrador": ["/", "/LoginSelectionRyE", "/LoginRyEAdministrador"],
            "/LoginRyEFuncionario": ["/", "/LoginSelectionRyE", "/LoginRyEFuncionario"],
            "/AdministradorDashboard": ["/", "/LoginSelectionRyE", "/LoginRyEAdministrador", "/AdministradorDashboard"],
            "/AdministradorDashboard/:id": ["/", "/LoginSelectionRyE", "/LoginRyEAdministrador", "/AdministradorDashboard", "/ListaFuncionarioRyE", "/AdministradorDashboard/:id"],
            "/FuncionarioDashboard": ["/", "/LoginSelectionRyE", "/LoginRyEFuncionario", "/FuncionarioDashboard"],
            "/ListaFuncionarioRyE": ["/", "/LoginSelectionRyE", "/LoginRyEAdministrador", "/AdministradorDashboard", "/ListaFuncionarioRyE"],

            // Estadísticas y reportes 
            "/Estadisticas": ["/", "/LoginSelectionRyE", "/LoginRyEAdministrador", "/AdministradorDashboard", "/Estadisticas"],
            "/Estadisticas/:id": ["/", "/LoginSelectionRyE", "/LoginRyEAdministrador", "/AdministradorDashboard", "/Estadisticas/:id"],
            "/Probabilidades": ["/", "/LoginSelectionRyE", "/LoginRyEAdministrador", "/AdministradorDashboard", "/Estadisticas", "/Probabilidades"],
            "/Probabilidades/:id": ["/", "/LoginSelectionRyE", "/LoginRyEAdministrador", "/AdministradorDashboard", "/Estadisticas"],
            "/AnalisisRiesgo": ["/", "/LoginSelectionRyE", "/LoginRyEAdministrador", "/AdministradorDashboard", "/Estadisticas", "/AnalisisRiesgo"],
            "/AnalisisRiesgo/:id": ["/", "/LoginSelectionRyE", "/LoginRyEAdministrador", "/AdministradorDashboard", "/Estadisticas"],
            "/EstadisticasSistema": ["/", "/LoginSelectionRyE", "/LoginRyEAdministrador", "/AdministradorDashboard", "/Estadisticas", "/EstadisticasSistema"],
            "/EstadisticasSistema/:id": ["/", "/LoginSelectionRyE", "/LoginRyEAdministrador", "/AdministradorDashboard", "/Estadisticas"],
        }
    };

    if (!path || typeof path !== "string") return [];


    // Rutas dinámicas de estadísticas SIEMPRE terminan en "Estadísticas"
    if (path.match(/^\/Estadisticas\/[^/]+$/)) {
        return hierarchy["/Estadisticas/:id"].map((fullPath) => ({
            label: aliases[fullPath],
            path: fullPath === "/Estadisticas/:id" ? path : fullPath
        }));
    }
    if (path.match(/^\/Probabilidades\/[^/]+$/)) {
        return hierarchy["/Probabilidades/:id"].map((fullPath) => ({
            label: aliases[fullPath],
            path: fullPath === "/Probabilidades/:id" ? path : fullPath
        }));
    }
    if (path.match(/^\/AnalisisRiesgo\/[^/]+$/)) {
        return hierarchy["/AnalisisRiesgo/:id"].map((fullPath) => ({
            label: aliases[fullPath],
            path: fullPath === "/AnalisisRiesgo/:id" ? path : fullPath
        }));
    }
    if (path.match(/^\/EstadisticasSistema\/[^/]+$/)) {
        return hierarchy["/EstadisticasSistema/:id"].map((fullPath) => ({
            label: aliases[fullPath],
            path: fullPath === "/EstadisticasSistema/:id" ? path : fullPath
        }));
    }
    // Detecta ruta dinámica de funcionario
    if (path.match(/^\/funcionarios\/[^/]+$/)) {
        return hierarchy["/funcionarios/:id"].map((fullPath) => ({
            label: aliases[fullPath] || decodeURIComponent(path.split("/").pop()),
            path: fullPath === "/funcionarios/:id" ? path : fullPath
        }));
    }
    // Detecta ruta dinámica de administrador dashboard en reportes
    if (path.match(/^\/AdministradorDashboard\/[^/]+$/)) {
        return hierarchy["/AdministradorDashboard/:id"].map((fullPath) => ({
            label: aliases[fullPath] || decodeURIComponent(path.split("/").pop()),
            path: fullPath === "/AdministradorDashboard/:id" ? path : fullPath
        }));
    }
    // Si la ruta tiene jerarquía definida, úsala
    if (hierarchy[path]) {
        return hierarchy[path].map((fullPath) => ({
            label: aliases[fullPath] || decodeURIComponent(fullPath.split("/").pop()),
            path: fullPath
        }));
    }
    // Si no, genera breadcrumbs normales
    const parts = path.split("/").filter(Boolean);
    let paths = [];
    for (let i = 0; i < parts.length; i++) {
        paths.push("/" + parts.slice(0, i + 1).join("/"));
    }
    return paths.map((fullPath) => {
        let alias = aliases[fullPath];
        if (!alias && fullPath.match(/^\/funcionarios\/[^/]+$/)) alias = aliases["/funcionarios/:id"];
        if (!alias && fullPath.match(/^\/AdministradorDashboard\/[^/]+$/)) alias = aliases["/AdministradorDashboard/:id"];
        if (!alias && fullPath.match(/^\/Estadisticas\/[^/]+$/)) alias = aliases["/Estadisticas"];
        if (!alias && fullPath.match(/^\/Probabilidades\/[^/]+$/)) alias = aliases["/Estadisticas"];
        if (!alias && fullPath.match(/^\/AnalisisRiesgo\/[^/]+$/)) alias = aliases["/Estadisticas"];
        if (!alias && fullPath.match(/^\/EstadisticasSistema\/[^/]+$/)) alias = aliases["/Estadisticas"];
        if (!alias && fullPath.match(/^\/admin\/[^/]+$/)) alias = aliases["/admin/:id"];
        return {
            label: alias || decodeURIComponent(fullPath.split("/").pop()),
            path: fullPath
        };
    });
}

export default function BreadCrumb({ path }) {
    const location = useLocation();
    const navigate = useNavigate();
    const crumbs = getBreadcrumbParts(path ?? location.pathname);

    return (
        <nav className="breadcrumb-container">
            {crumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                    {idx > 0 && <span className="breadcrumb-separator">/</span>}
                    {idx < crumbs.length - 1 ? (
                        <span className="breadcrumb-link">
                            <a href={crumb.path} onClick={e => { e.preventDefault(); navigate(crumb.path); }}>
                                {crumb.label}
                            </a>
                        </span>
                    ) : (
                        <span className="breadcrumb-current">{crumb.label}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}