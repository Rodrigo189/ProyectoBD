import "../assets/styles/Navbar.css";
import logo from "../assets/images/logo-eleam.png";

export default function Navbar({ titulo = "Ficha Clínica ELEAM" }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Logo ELEAM" className="navbar-logo" />
        <h1 className="navbar-title">{titulo}</h1>
      </div>

      <div className="navbar-links">
        <a href="/">Inicio</a>
        <a href="/ficha/crear" className="btn-nav">Nueva Ficha</a>
      </div>
    </nav>
  );
}
