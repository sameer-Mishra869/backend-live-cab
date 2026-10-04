import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/fare-estimate" className="navbar-brand">
        <img src="/logo.png" alt="CabBook Logo" style={{ height: '42px', width: '42px', borderRadius: '10px', objectFit: 'cover' }} />
        CabBook
      </Link>
      <ul className="navbar-links">
        <li><Link to="/fare-estimate" className={isActive('/fare-estimate')}>💰 Fare Estimate</Link></li>
        <li><Link to="/book-ride" className={isActive('/book-ride')}>🚗 Book Ride</Link></li>
        <li><Link to="/my-rides" className={isActive('/my-rides')}>📋 My Rides</Link></li>
        <li>
          <span style={{ 
            padding: '0.5rem 1rem', 
            fontSize: '0.85rem', 
            color: '#6c63ff', 
            fontWeight: 600,
            borderRight: '1px solid rgba(108,99,255,0.2)',
            marginRight: '0.5rem'
          }}>
            👋 {user.name}
            {user.role === 'admin' && (
              <span style={{ 
                marginLeft: '0.4rem', 
                background: 'rgba(247,201,72,0.15)', 
                color: '#f7c948',
                fontSize: '0.7rem',
                padding: '0.1rem 0.4rem',
                borderRadius: '4px'
              }}>ADMIN</span>
            )}
          </span>
        </li>
        <li>
          <button
            onClick={handleLogout}
            style={{
              background: 'rgba(255,92,122,0.15)',
              color: '#ff5c7a',
              border: '1px solid rgba(255,92,122,0.3)',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
