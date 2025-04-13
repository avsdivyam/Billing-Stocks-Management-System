import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROUTES } from '../../utils/constants';
import useForm from '../../hooks/useForm';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

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
    try {
      await login(values.username, values.password);
      toast.showSuccess('Login successful');
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      toast.showError(error.error || 'Login failed');
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

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login to your account</h2>
      
      <form onSubmit={submitForm} className="space-y-6">
        {/* Username field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <div className="mt-1">
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`appearance-none block w-full px-3 py-2 border ${
                touched.username && errors.username ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
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
          <div className="mt-1">
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`appearance-none block w-full px-3 py-2 border ${
                touched.password && errors.password ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
            />
            {touched.password && errors.password && (
              <p className="mt-2 text-sm text-red-600">{errors.password}</p>
            )}
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
          <Link to={ROUTES.REGISTER} className="font-medium text-primary-600 hover:text-primary-500">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;