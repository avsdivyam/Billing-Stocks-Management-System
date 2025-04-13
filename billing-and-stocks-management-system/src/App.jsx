import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { ROUTES } from './utils/constants';
import './App.css';

// Import pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';
import Vendors from './pages/vendors/Vendors';

// Import inventory pages
import Products from './pages/inventory/Products';
import LowStock from './pages/inventory/LowStock';
import Categories from './pages/inventory/Categories';
import BarcodeManager from './pages/BarcodeManager';

// Import repair pages
import RepairServices from './pages/repair/RepairServices';
import RepairJobForm from './pages/repair/RepairJobForm';
import RepairInvoice from './pages/repair/RepairInvoice';

// Import billing pages
import Sales from './pages/billing/Sales';
import NewSale from './pages/billing/NewSale';
import Purchases from './pages/billing/Purchases';
import NewPurchase from './pages/billing/NewPurchase';

// Import report pages
import SalesReport from './pages/reports/SalesReport';

// Import tools pages
import QRScanner from './pages/tools/QRScanner';
import SpeechRecognition from './pages/tools/SpeechRecognition';

// Import layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';

// Import custom components
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingScreen from './components/ui/LoadingScreen';

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* Auth routes */}
              <Route path={ROUTES.LOGIN} element={<AuthLayout><Login /></AuthLayout>} />
              <Route path={ROUTES.REGISTER} element={<AuthLayout><Register /></AuthLayout>} />
              
              {/* Protected routes - using inline protection for now */}
              <Route path={ROUTES.DASHBOARD} element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              } />
              
              <Route path={ROUTES.PROFILE} element={
                <MainLayout>
                  <Profile />
                </MainLayout>
              } />
              
              <Route path={ROUTES.SETTINGS} element={
                <MainLayout>
                  <Settings />
                </MainLayout>
              } />
              
              <Route path={ROUTES.VENDORS} element={
                <MainLayout>
                  <Vendors />
                </MainLayout>
              } />
              
              {/* Inventory routes */}
              <Route path={ROUTES.INVENTORY.CATEGORIES} element={
                <MainLayout>
                  <Categories />
                </MainLayout>
              } />
              
              <Route path={ROUTES.INVENTORY.PRODUCTS} element={
                <MainLayout>
                  <Products />
                </MainLayout>
              } />
              
              <Route path={ROUTES.INVENTORY.LOW_STOCK} element={
                <MainLayout>
                  <LowStock />
                </MainLayout>
              } />
              
              <Route path={ROUTES.INVENTORY.BARCODES} element={
                <MainLayout>
                  <BarcodeManager />
                </MainLayout>
              } />
              
              {/* Repair routes */}
              <Route path={ROUTES.REPAIR.SERVICES} element={
                <MainLayout>
                  <RepairServices />
                </MainLayout>
              } />
              
              <Route path={`${ROUTES.REPAIR.SERVICES}/new`} element={
                <MainLayout>
                  <RepairJobForm />
                </MainLayout>
              } />
              
              <Route path={`${ROUTES.REPAIR.SERVICES}/edit/:id`} element={
                <MainLayout>
                  <RepairJobForm />
                </MainLayout>
              } />
              
              <Route path={`${ROUTES.REPAIR.SERVICES}/invoice/:id`} element={
                <MainLayout>
                  <RepairInvoice />
                </MainLayout>
              } />
              
              {/* Billing routes */}
              <Route path={ROUTES.BILLING.SALES} element={
                <MainLayout>
                  <Sales />
                </MainLayout>
              } />
              
              <Route path={ROUTES.BILLING.NEW_SALE} element={
                <MainLayout>
                  <NewSale />
                </MainLayout>
              } />
              
              <Route path={ROUTES.BILLING.PURCHASES} element={
                <MainLayout>
                  <Purchases />
                </MainLayout>
              } />
              
              <Route path={ROUTES.BILLING.NEW_PURCHASE} element={
                <MainLayout>
                  <NewPurchase />
                </MainLayout>
              } />
              
              {/* Report routes */}
              <Route path={ROUTES.REPORTS.SALES} element={
                <MainLayout>
                  <SalesReport />
                </MainLayout>
              } />
              
              {/* Tools routes */}
              <Route path={ROUTES.OCR.SCAN} element={
                <MainLayout>
                  <QRScanner />
                </MainLayout>
              } />
              
              <Route path={ROUTES.SPEECH.RECOGNIZE} element={
                <MainLayout>
                  <SpeechRecognition />
                </MainLayout>
              } />
              
              {/* Admin routes */}
              <Route path="/admin/*" element={
                <MainLayout requiredRoles={['admin']}>
                  {/* Admin components will go here */}
                  <h1>Admin Dashboard</h1>
                </MainLayout>
              } />
              
              {/* Redirect root to dashboard or login */}
              <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              
              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
