// src/components/RutaProtegida.jsx (NUEVO)
import { Navigate, Outlet } from 'react-router-dom';

const useAuth = () => {
  // Revisa si guardamos el "usuario" en el navegador
  const usuario = localStorage.getItem('usuario');
  return usuario ? true : false;
};

const RutaProtegida = () => {
  const isAuth = useAuth();
  
  if (!isAuth) {
    // Si no está logueado, lo patea al Login
    alert("Debe iniciar sesión para acceder a esta área.");
    return <Navigate to="/login" replace />;
  }
  
  // Si está logueado, muestra el Layout (que a su vez muestra la página)
  return <Outlet />;
};

export default RutaProtegida;