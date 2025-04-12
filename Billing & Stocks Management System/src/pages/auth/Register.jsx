import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROUTES } from '../../utils/constants';
import useForm from '../../hooks/useForm';
import { isValidEmail, isStrongPassword } from '../../utils/validators';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Form validation
  const validate = (values) => {
    const errors = {};
    
    if (!values.username) {
      errors.username = 'Username is required';
    } else if (values.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(values.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (!values.full_name) {
      errors.full_name = 'Full name is required';
    }
    
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (!isStrongPassword(values.password)) {
      errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }
    
    if (!values.confirm_password) {
      errors.confirm_password = 'Please confirm your password';
    } else if (values.password !== values.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
    }
    
    return errors;
  };

  // Form submission
  const handleSubmit = async (values) => {
    setIsLoading(true);
    try {
      // Remove confirm_password before sending to API
      const { confirm_password, ...userData } = values;
      
      await register(userData);
      toast.showSuccess('Registration successful. You can now login.');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.showError(error.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize form
  const { values, errors, touched, handleChange, handleBlur, handleSubmit: submitForm } = useForm(
    {
      username: '',
      email: '',
      full_name: '',
      phone: '',
      password: '',
      confirm_password: '',
    },
    handleSubmit,
    validate
  );

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create a new account</h2>
      
      <form onSubmit={submitForm} className="space-y-4">
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
              <p className="mt-1 text-sm text-red-600">{errors.username}</p>
            )}
          </div>
        </div>

        {/* Email field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="mt-1">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`appearance-none block w-full px-3 py-2 border ${
                touched.email && errors.email ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
            />
            {touched.email && errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>
        </div>

        {/* Full name field */}
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <div className="mt-1">
            <input
              id="full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              required
              value={values.full_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`appearance-none block w-full px-3 py-2 border ${
                touched.full_name && errors.full_name ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
            />
            {touched.full_name && errors.full_name && (
              <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
            )}
          </div>
        </div>

        {/* Phone field (optional) */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone (optional)
          </label>
          <div className="mt-1">
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
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
              autoComplete="new-password"
              required
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`appearance-none block w-full px-3 py-2 border ${
                touched.password && errors.password ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
            />
            {touched.password && errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>
        </div>

        {/* Confirm password field */}
        <div>
          <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="mt-1">
            <input
              id="confirm_password"
              name="confirm_password"
              type="password"
              autoComplete="new-password"
              required
              value={values.confirm_password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`appearance-none block w-full px-3 py-2 border ${
                touched.confirm_password && errors.confirm_password ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm`}
            />
            {touched.confirm_password && errors.confirm_password && (
              <p className="mt-1 text-sm text-red-600">{errors.confirm_password}</p>
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
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>

      {/* Login link */}
      <div className="mt-6">
        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="font-medium text-primary-600 hover:text-primary-500">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;