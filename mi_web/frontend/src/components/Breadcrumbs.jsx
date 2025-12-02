// src/components/Breadcrumbs.jsx (CORREGIDO)
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Mapeo personalizado para los nombres de las rutas
  const routeNames = {
    '': 'Inicio',
    'fichas': 'Fichas Clínicas',
    'crear': 'Nueva Ficha',
    'editar': 'Editar',
    'admin': 'Administración',
    'tratantes': 'Tratantes',
    'login': 'Acceso',
    'menu': 'Inicio'
  };

  // Si estamos en la página de inicio (/ o /menu), no mostrar breadcrumb
  if (location.pathname === '/' || location.pathname === '/menu') {
    return null;
  }

  return (
    <div className="breadcrumbs-inline">
      {/* Siempre mostrar "Inicio" como primer elemento */}
      <span className="breadcrumb-item-inline">
        <Link to="/" className="breadcrumb-link-inline">
          Inicio
        </Link>
        <span className="breadcrumb-separator-inline"> / </span>
      </span>

      {pathnames.map((value, index) => {
        const isLast = index === pathnames.length - 1;
        const pathTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const displayName = routeNames[value] || value;

        return (
          <span key={pathTo} className="breadcrumb-item-inline">
            {isLast ? (
              <span className="breadcrumb-current-inline">{displayName}</span>
            ) : (
              <>
                <Link to={pathTo} className="breadcrumb-link-inline">
                  {displayName}
                </Link>
                <span className="breadcrumb-separator-inline"> / </span>
              </>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default Breadcrumbs;