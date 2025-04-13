import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROUTES } from '../../utils/constants';
import useForm from '../../hooks/useForm';
import { FiAlertCircle, FiLock, FiUser } from 'react-icons/fi';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error: authError, clearError, isAuthenticated } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  // Get redirect path from location state or default to dashboard
  const from = location.state?.from || ROUTES.DASHBOARD;

  // Check for session_expired parameter in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('session_expired') === 'true') {
      setLoginError('Your session has expired. Please log in again.');
    }
    
    // Clear any previous auth errors when component mounts
    if (clearError) {
      clearError();
    }
  }, [location.search, clearError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // Form validation
  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = 'Username is required';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    }
    return errors;
  };

  // Form submission
  const handleSubmit = async (values) => {
    setIsLoading(true);
    setLoginError(null);
    
    try {
      await login(values.username, values.password);
      toast.showSuccess('Login successful');
      // Navigate to the page user was trying to access or dashboard
      navigate(from, { replace: true });
    } catch (error) {
      setLoginError(error.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize form
  const { values, errors, touched, handleChange, handleBlur, handleSubmit: submitForm } = useForm(
    { username: '', password: '' },
    handleSubmit,
    validate
  );

  // Display error message
  const errorMessage = loginError || authError;

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to your account</h2>
      
      {/* Error message */}
      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
          <FiAlertCircle className="text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <span className="text-red-700">{errorMessage}</span>
        </div>
      )}
      
      <form onSubmit={submitForm} className="space-y-6">
        {/* Username field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiUser className="text-gray-400" />
            </div>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`pl-10 appearance-none block w-full px-3 py-2 border ${
                touched.username && errors.username ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
              placeholder="Enter your username"
            />
            {touched.username && errors.username && (
              <p className="mt-2 text-sm text-red-600">{errors.username}</p>
            )}
          </div>
        </div>

        {/* Password field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`pl-10 appearance-none block w-full px-3 py-2 border ${
                touched.password && errors.password ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
              placeholder="Enter your password"
            />
            {touched.password && errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
        </div>

        {/* Remember me & Forgot password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <div className="text-sm">
            <Link to={ROUTES.FORGOT_PASSWORD || '/forgot-password'} className="font-medium text-primary-600 hover:text-primary-500">
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Submit button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>

      {/* Register link */}
      <div className="mt-6">
        <p className="text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to={ROUTES.REGISTER || '/register'} className="font-medium text-primary-600 hover:text-primary-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;