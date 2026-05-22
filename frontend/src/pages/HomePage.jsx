import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/HomePage.css';

/**
 * HomePage component - Main layout wrapper for authenticated home pages
 * Provides navigation bar and renders child routes via Outlet
 * Displays active page indicator on navigation links
 *
 * @returns {React.ReactNode} HomePage layout with navbar and nested routes
 */
const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const navItems = [
    { label: 'Residences', path: '/home/residences' },
    { label: 'Tasks', path: '/home/tasks' },
    { label: 'History', path: '/home/history' },
    { label: 'Assignments', path: '/home/assignments' },
    { label: 'Profile', path: '/home/profile' },
  ];

  /**
   * Determines if a nav link is currently active
   *
   * @param {string} path - The navigation path to check
   * @returns {boolean} True if current location matches the path
   */
  const isActive = (path) => location.pathname === path;

  /**
   * Handles navigation link click
   *
   * @param {string} path - The path to navigate to
   */
  const handleNavClick = (path) => {
    navigate(path);
  };

  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <h1>Residential Management</h1>
          </div>
          <ul className="navbar-nav">
            {navItems.map((item) => (
              <li key={item.path}>
                <button
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.path)}
                  type="button"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="page-outlet">
        <Outlet />
      </div>
    </div>
  );
};

export default HomePage;
