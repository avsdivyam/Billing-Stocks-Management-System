import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ROUTES } from './utils/constants';
import './App.css';

// Import pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Import layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
};

// Admin route component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!isAdmin) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Auth routes */}
              <Route path={ROUTES.LOGIN} element={<AuthLayout><Login /></AuthLayout>} />
              <Route path={ROUTES.REGISTER} element={<AuthLayout><Register /></AuthLayout>} />
              
              {/* Protected routes */}
              <Route path={ROUTES.DASHBOARD} element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              <Route path={ROUTES.PROFILE} element={
                <ProtectedRoute>
                  <MainLayout>
                    <Profile />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              {/* Redirect root to dashboard or login */}
              <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
