import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';
import LoadingScreen from '../components/ui/LoadingScreen';

const AuthLayout = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);
  
  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen message="Checking authentication..." />;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Billing & Stocks Management System
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Manage your inventory, sales, and purchases efficiently
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {children}
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Billing & Stocks Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;