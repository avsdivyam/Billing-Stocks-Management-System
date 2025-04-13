import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingScreen from '../ui/LoadingScreen';

/**
 * ProtectedRoute component to handle route protection based on authentication and roles
 * 
 * @param {Object} props Component props
 * @param {React.ReactNode} props.children Child components to render if authorized
 * @param {string[]} [props.allowedRoles] Optional array of roles allowed to access the route
 * @param {boolean} [props.requireAuth=true] Whether authentication is required (defaults to true)
 * @param {string} [props.loginPath='/login'] Path to redirect to if not authenticated
 * @param {string} [props.dashboardPath='/dashboard'] Path to redirect to if not authorized
 * @returns {React.ReactNode} The protected component or redirect
 */
const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  requireAuth = true,
  loginPath = '/login',
  dashboardPath = '/dashboard'
}) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  // Show loading screen while auth state is being determined
  if (loading) {
    return <LoadingScreen message="Authenticating..." />;
  }

  // If authentication is not required, render children
  if (!requireAuth) {
    return children;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={loginPath} state={{ from: location.pathname }} replace />;
  }

  // If no specific roles are required, or user is admin, allow access
  if (allowedRoles.length === 0 || user?.role === 'admin') {
    return children;
  }

  // Check if user has one of the allowed roles
  if (user && allowedRoles.includes(user.role)) {
    return children;
  }

  // If user doesn't have required role, redirect to dashboard
  return <Navigate to={dashboardPath} replace />;
};

export default ProtectedRoute;