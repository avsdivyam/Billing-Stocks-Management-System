import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';

/**
 * Custom hook to protect routes based on authentication and roles
 * 
 * @param {Object} options Hook options
 * @param {boolean} [options.requireAuth=true] Whether authentication is required
 * @param {string[]} [options.allowedRoles=[]] Roles allowed to access the route
 * @param {string} [options.redirectTo=ROUTES.LOGIN] Where to redirect if not authorized
 * @returns {Object} Auth guard state
 * @returns {boolean} .isAuthorized Whether the user is authorized
 * @returns {boolean} .isLoading Whether the auth check is still loading
 */
const useAuthGuard = ({
  requireAuth = true,
  allowedRoles = [],
  redirectTo = ROUTES.LOGIN
} = {}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Skip check if still loading auth state
    if (loading) return;
    
    setIsChecking(true);
    
    // If authentication is not required, allow access
    if (!requireAuth) {
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }
    
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate(redirectTo, { 
        state: { from: location.pathname },
        replace: true 
      });
      setIsAuthorized(false);
      setIsChecking(false);
      return;
    }
    
    // If no specific roles are required, or user is admin, allow access
    if (allowedRoles.length === 0 || user?.role === 'admin') {
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }
    
    // Check if user has one of the allowed roles
    if (user && allowedRoles.includes(user.role)) {
      setIsAuthorized(true);
      setIsChecking(false);
      return;
    }
    
    // If user doesn't have required role, redirect to dashboard
    navigate(ROUTES.DASHBOARD, { replace: true });
    setIsAuthorized(false);
    setIsChecking(false);
  }, [isAuthenticated, user, loading, navigate, location.pathname, requireAuth, allowedRoles, redirectTo]);

  return { 
    isAuthorized, 
    isLoading: loading || isChecking 
  };
};

export default useAuthGuard;