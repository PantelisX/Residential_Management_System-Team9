import { useEffect, useState } from 'react';
import api from '../services/api';
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

  const auth  = useAuth();

  const user = auth.user || JSON.parse(localStorage.getItem('user'));

  console.log(user);

  const navItems = [
    { label: 'Residences', path: '/home/residences' },
    { label: 'Tasks', path: '/home/tasks' },
    { label: 'History', path: '/home/history' },

    ...(user && Number(user?.is_technician) === 1 ? [{ label: 'Assignments', path: '/home/assignments' }] : []),
    { label: 'Profile', path: '/home/profile' },
  ];

  const [notifications, setNotifications] =
    useState([]);

  const [currentNotification,setCurrentNotification] = useState(null);

  /**
   * Determines if a nav link is currently active
   *
   * @param {string} path
   * @returns {boolean}
   */
  const isActive = (path) => location.pathname === path;

  /**
   * Handles navigation link click
   *
   * @param {string} path
   */
  const handleNavClick = (path) => {navigate(path);};

  /**
   * Fetch notifications
   */
  useEffect(() => {

    const fetchNotifications =
      async () => {

        try {

          const response =
            await api.get(
              '/api/notifications'
            );

          const notifications = response.data.notifications;

          if (notifications.length > 0 && !currentNotification) {

            setNotifications(notifications);

            setCurrentNotification(notifications[0]);
          }

        } catch (err) {

          console.error('Notification error:',err);
        }
      };

    fetchNotifications();

    const interval = setInterval(fetchNotifications,5000);

    return () =>
      clearInterval(interval);

  }, []);

  /**
   * Handle next notification
   */
  const handleNextNotification =
    async () => {

      try {

        await api.put(`/api/notifications/${currentNotification.notification_id}/read`);

      } catch (err) {

        console.error('Error updating notification:',err);
      }

      const updatedNotifications =notifications.slice(1);

      setNotifications(updatedNotifications);

      if (updatedNotifications.length > 0) {

        setCurrentNotification(updatedNotifications[0]);

      } else {

        setCurrentNotification(null);
      }
    };

  return (

    <div className="homepage">

      {currentNotification && (

        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform:
              'translate(-50%, -50%)',
            background: 'white',
            border: '1px solid black',
            padding: '20px',
            borderRadius: '10px',
            zIndex: 9999,
            boxShadow:
              '0 0 10px rgba(0,0,0,0.2)',
            minWidth: '400px'
          }}
        >

          <h3 style={{marginBottom: '15px'}}>
            {currentNotification.title}
          </h3>

          <p style={{  marginBottom: '10px'}}>
            {
              currentNotification.message
            }
          </p>

          <p style={{ marginBottom: '10px'}}>
            <strong>
              Description:
            </strong>
            {' '}
            {currentNotification.description}
          </p>

          <p style={{marginBottom: '15px'}}>
            <strong>
              Start Date:
            </strong>
            {' '}
            {currentNotification.start_date ? new Date(currentNotification.start_date).toLocaleString() : 'N/A'}
          </p>

          <button
            onClick={handleNextNotification}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: 'none',
              background: '#1976d2',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            OK
          </button>

        </div>
      )}

      <nav className="navbar">

        <div className="navbar-container">

          <div className="navbar-brand">

            <h1>
              Residential Management
            </h1>

          </div>

          <ul className="navbar-nav">

            {navItems.map((item) => (

              <li key={item.path}>

                <button className={`nav-link ${ isActive(item.path)? 'active' : ''}`}
                  onClick={() =>
                    handleNavClick(
                      item.path
                    )
                  }
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