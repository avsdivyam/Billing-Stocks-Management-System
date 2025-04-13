import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <h2 className="text-6xl font-extrabold text-primary-600 mb-2">404</h2>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h3>
          <p className="text-gray-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
            <Link
              to={ROUTES.DASHBOARD}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FiHome className="mr-2" />
              Go to Dashboard
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <FiArrowLeft className="mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;