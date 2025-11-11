import Navbar from "../components/Navbar";

export default function NotFound() {
  return (
    <div>
      <Navbar titulo="Ficha Clínica ELEAM" />
      <div className="container">
        <h2>Error 404</h2>
        <p>Página no encontrada.</p>
        <button onClick={() => (window.location.href = "/")}>
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
