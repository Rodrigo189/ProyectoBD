import React from "react";
import { useLocation } from "react-router-dom";
import logo from "../img/logo.png";
import Breadcrumbs from "./BreadCrumbs";
import "../styles/Header.css";

export default function Header() {
    const location = useLocation();

    return (
        <header className="funcionario-header">
            <div className="funcionario-header-inner">
                <div className="funcionario-brand">
                    <img src={logo} alt="Red ELEAM" className="funcionario-logo" />
                    <div className="funcionario-brand-texts">
                        <span className="funcionario-brand-red">Red</span>
                        <span className="funcionario-brand-eleam">ELEAM</span>
                    </div>
                </div>
                <Breadcrumbs path={location.pathname} />
            </div>
        </header>
    );
}