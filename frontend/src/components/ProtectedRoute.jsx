import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * ProtectedRoute component - Wraps routes that require authentication
 * Redirects unauthenticated users to home (will redirect to login once implemented)
 * Shows loading state while auth is being verified
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child component to render if authenticated
 * @returns {React.ReactNode} Child component if authenticated, loading state during verification, or redirect if not authenticated
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
