import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to use authentication context
 * @returns {Object} Auth context values
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
