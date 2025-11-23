// src/components/Breadcrumbs.jsx
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav style={{ marginBottom: '20px', fontSize: '14px', padding: '5px 0', backgroundColor: '#f5f5f5', borderRadius: '5px' }}>
      <ul style={{ display: 'flex', listStyle: 'none', padding: 0, margin: 0 }}>
        <li>
          <Link to="/" style={{ color: '#00bcd4', textDecoration: 'none', fontWeight: 'bold' }}>
            Inicio
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const pathTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          return (
            <li key={pathTo} style={{ marginLeft: '10px', fontWeight: 'bold' }}>
              <span style={{ color: '#4CAF50' }}>&gt;</span>
              <Link to={pathTo} style={{ color: '#009688', textDecoration: 'none' }}>
                {value.charAt(0).toUpperCase() + value.slice(1).replace(/-/g, ' ')}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
