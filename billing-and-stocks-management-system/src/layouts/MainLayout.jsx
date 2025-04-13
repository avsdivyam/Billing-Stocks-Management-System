import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';
import LoadingScreen from '../components/ui/LoadingScreen';

// Import icons
import { 
  FiMenu, FiX, FiHome, FiUser, FiUsers, FiShoppingBag, 
  FiPackage, FiFileText, FiCamera, FiMic, FiDatabase, 
  FiSettings, FiLogOut, FiChevronDown, FiChevronUp, FiTool,
  FiChevronsLeft, FiChevronsRight, FiAlertCircle, FiDollarSign,
  FiCreditCard, FiBarChart2, FiPieChart, FiPlus
} from 'react-icons/fi';

const MainLayout = ({ children, requiredRoles = [] }) => {
  const { user, logout, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });
  const [dropdowns, setDropdowns] = useState({
    inventory: false,
    repair: false,
    billing: false,
    reports: false,
  });
  
  // Check if user is authenticated when the component mounts
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: location.pathname }, replace: true });
    }
  }, [isAuthenticated, loading, navigate, location.pathname]);
  
  // Save sidebar collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);
  
  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen message="Authenticating..." />;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location.pathname }} replace />;
  }
  
  // If specific roles are required, check if user has one of them
  if (requiredRoles.length > 0) {
    const hasRequiredRole = user?.role === 'admin' || requiredRoles.includes(user?.role);
    if (!hasRequiredRole) {
      return <Navigate to={ROUTES.DASHBOARD} replace />;
    }
  }

  // Toggle dropdown menu
  const toggleDropdown = (menu) => {
    // If sidebar is collapsed, expand it first when opening a dropdown
    if (sidebarCollapsed && !dropdowns[menu]) {
      setSidebarCollapsed(false);
      // Set a small timeout to ensure the sidebar expands before opening the dropdown
      setTimeout(() => {
        setDropdowns((prev) => ({
          ...prev,
          [menu]: true,
        }));
      }, 150);
    } else {
      setDropdowns((prev) => ({
        ...prev,
        [menu]: !prev[menu],
      }));
    }
  };
  
  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      // If we're collapsing the sidebar, close all dropdowns
      if (!prev) {
        setDropdowns({
          inventory: false,
          repair: false,
          billing: false,
          reports: false,
        });
      }
      return !prev;
    });
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  // Check if route is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Check if route is in active group
  const isActiveGroup = (paths) => {
    return paths.some((path) => location.pathname.startsWith(path));
  };

  return (
    <div className="flex flex-col h-screen">
  <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
    <div className="flex items-center justify-between h-16 px-4">
      <div className="flex items-center">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-1 rounded-md mr-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring md:hidden"
        >
          <FiMenu size={24} />
        </button>
        <button
          onClick={toggleSidebar}
          className="p-1 ml-2 rounded-md mr-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring hidden md:block"
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <FiChevronsRight size={20} /> : <FiChevronsLeft size={20} />}
        </button>
        <span className="text-xl font-semibold text-primary-600">Billing & Stocks</span>
      </div>

      {/* User dropdown */}
      <div className="relative ml-auto">
        <div className="flex items-center">
          <span className="mr-2 text-sm font-medium text-gray-700">
            {user?.full_name || user?.username}
          </span>
          <Link
            to={ROUTES.PROFILE}
            className="p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            <FiUser size={20} />
          </Link>
          <Link
            to={ROUTES.SETTINGS}
            className="p-1 ml-2 rounded-md text-gray-500 hover:text-gray-700"
            title="Settings"
          >
            <FiSettings size={20} />
          </Link>
          <button
            onClick={handleLogout}
            className="p-1 ml-2 rounded-md text-gray-500 hover:text-gray-700"
            title="Logout"
          >
            <FiLogOut size={20} />
          </button>
        </div>
      </div>
    </div>
  </header>
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 ${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white shadow-lg transform transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Sidebar header */}
        {/* <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link to={ROUTES.DASHBOARD} className="flex items-center">
            {sidebarCollapsed ? (
              <span className="text-xl font-semibold text-primary-600">B&S</span>
            ) : (
              <span className="text-xl font-semibold text-primary-600">Billing & Stocks</span>
            )}
          </Link>
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md text-gray-500 hover:text-gray-700 hidden md:block"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? <FiChevronsRight size={20} /> : <FiChevronsLeft size={20} />}
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md text-gray-500 hover:text-gray-700 md:hidden"
            >
              <FiX size={24} />
            </button>
          </div>
        </div> */}

        {/* Sidebar content */}
        <div className="py-4 overflow-y-auto h-[calc(100vh-4rem)]" style={{ marginTop: '4rem' }}>
          <ul className="space-y-1 px-2">
            {/* Dashboard */}
            <li>
              <Link
                to={ROUTES.DASHBOARD}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-4 py-2 rounded-md ${
                  isActive(ROUTES.DASHBOARD)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title="Dashboard"
              >
                <FiHome className={sidebarCollapsed ? '' : 'mr-3'} size={18} />
                {!sidebarCollapsed && <span>Dashboard</span>}
              </Link>
            </li>

            {/* Inventory */}
            <li>
              <button
                onClick={() => toggleDropdown('inventory')}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} w-full px-4 py-2 rounded-md ${
                  isActiveGroup([ROUTES.INVENTORY.CATEGORIES, ROUTES.INVENTORY.PRODUCTS, ROUTES.INVENTORY.LOW_STOCK, ROUTES.INVENTORY.BARCODES])
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title="Inventory"
              >
                <div className="flex items-center">
                  <FiPackage className={sidebarCollapsed ? '' : 'mr-3'} size={18} />
                  {!sidebarCollapsed && <span>Inventory</span>}
                </div>
                {!sidebarCollapsed && (dropdowns.inventory ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />)}
              </button>

              {dropdowns.inventory && (
                <ul className={`${sidebarCollapsed ? 'pl-0 text-center' : 'pl-10'} mt-1 space-y-1`}>
                  <li>
                    <Link
                      to={ROUTES.INVENTORY.CATEGORIES}
                      className={`block px-2 py-2 rounded-md ${
                        isActive(ROUTES.INVENTORY.CATEGORIES)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${sidebarCollapsed ? 'text-xs' : ''}`}
                      title="Categories"
                    >
                      {sidebarCollapsed ? (
                        <div className="flex flex-col items-center">
                          <FiPackage size={14} className="mb-1" />
                          <span>Cat</span>
                        </div>
                      ) : (
                        'Categories'
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.INVENTORY.PRODUCTS}
                      className={`block px-2 py-2 rounded-md ${
                        isActive(ROUTES.INVENTORY.PRODUCTS)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${sidebarCollapsed ? 'text-xs' : ''}`}
                      title="Products"
                    >
                      {sidebarCollapsed ? (
                        <div className="flex flex-col items-center">
                          <FiShoppingBag size={14} className="mb-1" />
                          <span>Prod</span>
                        </div>
                      ) : (
                        'Products'
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.INVENTORY.LOW_STOCK}
                      className={`block px-2 py-2 rounded-md ${
                        isActive(ROUTES.INVENTORY.LOW_STOCK)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${sidebarCollapsed ? 'text-xs' : ''}`}
                      title="Low Stock"
                    >
                      {sidebarCollapsed ? (
                        <div className="flex flex-col items-center">
                          <FiAlertCircle size={14} className="mb-1" />
                          <span>Low</span>
                        </div>
                      ) : (
                        'Low Stock'
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.INVENTORY.BARCODES}
                      className={`block px-2 py-2 rounded-md ${
                        isActive(ROUTES.INVENTORY.BARCODES)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${sidebarCollapsed ? 'text-xs' : ''}`}
                      title="Barcodes"
                    >
                      {sidebarCollapsed ? (
                        <div className="flex flex-col items-center">
                          <FiCamera size={14} className="mb-1" />
                          <span>Codes</span>
                        </div>
                      ) : (
                        'Barcodes & QR'
                      )}
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Repair Services */}
            <li>
              <button
                onClick={() => toggleDropdown('repair')}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} w-full px-4 py-2 rounded-md ${
                  isActiveGroup([
                    ROUTES.REPAIR.SERVICES,
                  ])
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title="Repair Services"
              >
                <div className="flex items-center">
                  <FiTool className={sidebarCollapsed ? '' : 'mr-3'} size={18} />
                  {!sidebarCollapsed && <span>Repair Services</span>}
                </div>
                {!sidebarCollapsed && (dropdowns.repair ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />)}
              </button>

              {dropdowns.repair && (
                <ul className={`${sidebarCollapsed ? 'pl-0 text-center' : 'pl-10'} mt-1 space-y-1`}>
                  <li>
                    <Link
                      to={ROUTES.REPAIR.SERVICES}
                      className={`block px-2 py-2 rounded-md ${
                        isActive(ROUTES.REPAIR.SERVICES)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${sidebarCollapsed ? 'text-xs' : ''}`}
                      title="Manage Repairs"
                    >
                      {sidebarCollapsed ? (
                        <div className="flex flex-col items-center">
                          <FiTool size={14} className="mb-1" />
                          <span>Manage</span>
                        </div>
                      ) : (
                        'Manage Repairs'
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={`${ROUTES.REPAIR.SERVICES}/new`}
                      className={`block px-2 py-2 rounded-md ${
                        isActive(`${ROUTES.REPAIR.SERVICES}/new`)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${sidebarCollapsed ? 'text-xs' : ''}`}
                      title="New Repair Job"
                    >
                      {sidebarCollapsed ? (
                        <div className="flex flex-col items-center">
                          <FiPlus size={14} className="mb-1" />
                          <span>New</span>
                        </div>
                      ) : (
                        'New Repair Job'
                      )}
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Billing */}
            <li>
              <button
                onClick={() => toggleDropdown('billing')}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} w-full px-4 py-2 rounded-md ${
                  isActiveGroup([
                    ROUTES.BILLING.CUSTOMERS,
                    ROUTES.BILLING.SALES,
                    ROUTES.BILLING.PURCHASES,
                  ])
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title="Billing"
              >
                <div className="flex items-center">
                  <FiDollarSign className={sidebarCollapsed ? '' : 'mr-3'} size={18} />
                  {!sidebarCollapsed && <span>Billing</span>}
                </div>
                {!sidebarCollapsed && (dropdowns.billing ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />)}
              </button>

              {dropdowns.billing && (
                <ul className={`${sidebarCollapsed ? 'pl-0 text-center' : 'pl-10'} mt-1 space-y-1`}>
                  <li>
                    <Link
                      to={ROUTES.BILLING.CUSTOMERS}
                      className={`block px-2 py-2 rounded-md ${
                        isActive(ROUTES.BILLING.CUSTOMERS)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${sidebarCollapsed ? 'text-xs' : ''}`}
                      title="Customers"
                    >
                      {sidebarCollapsed ? (
                        <div className="flex flex-col items-center">
                          <FiUsers size={14} className="mb-1" />
                          <span>Cust</span>
                        </div>
                      ) : (
                        'Customers'
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.BILLING.SALES}
                      className={`block px-2 py-2 rounded-md ${
                        isActiveGroup([ROUTES.BILLING.SALES, ROUTES.BILLING.NEW_SALE, ROUTES.BILLING.EDIT_SALE])
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${sidebarCollapsed ? 'text-xs' : ''}`}
                      title="Sales"
                    >
                      {sidebarCollapsed ? (
                        <div className="flex flex-col items-center">
                          <FiShoppingBag size={14} className="mb-1" />
                          <span>Sales</span>
                        </div>
                      ) : (
                        'Sales'
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.BILLING.PURCHASES}
                      className={`block px-2 py-2 rounded-md ${
                        isActiveGroup([ROUTES.BILLING.PURCHASES, ROUTES.BILLING.NEW_PURCHASE, ROUTES.BILLING.EDIT_PURCHASE])
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${sidebarCollapsed ? 'text-xs' : ''}`}
                      title="Purchases"
                    >
                      {sidebarCollapsed ? (
                        <div className="flex flex-col items-center">
                          <FiCreditCard size={14} className="mb-1" />
                          <span>Purch</span>
                        </div>
                      ) : (
                        'Purchases'
                      )}
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Reports */}
            <li>
              <button
                onClick={() => toggleDropdown('reports')}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} w-full px-4 py-2 rounded-md ${
                  isActiveGroup([
                    ROUTES.REPORTS.SALES,
                    ROUTES.REPORTS.PURCHASES,
                    ROUTES.REPORTS.GST,
                    ROUTES.REPORTS.INVENTORY,
                  ])
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title="Reports"
              >
                <div className="flex items-center">
                  <FiBarChart2 className={sidebarCollapsed ? '' : 'mr-3'} size={18} />
                  {!sidebarCollapsed && <span>Reports</span>}
                </div>
                {!sidebarCollapsed && (dropdowns.reports ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />)}
              </button>

              {dropdowns.reports && (
                <ul className={`${sidebarCollapsed ? 'pl-0 text-center' : 'pl-10'} mt-1 space-y-1`}>
                  <li>
                    <Link
                      to={ROUTES.REPORTS.SALES}
                      className={`block px-2 py-2 rounded-md ${
                        isActive(ROUTES.REPORTS.SALES)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${sidebarCollapsed ? 'text-xs' : ''}`}
                      title="Sales Report"
                    >
                      {sidebarCollapsed ? (
                        <div className="flex flex-col items-center">
                          <FiShoppingBag size={14} className="mb-1" />
                          <span>Sales</span>
                        </div>
                      ) : (
                        'Sales Report'
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.REPORTS.PURCHASES}
                      className={`block px-2 py-2 rounded-md ${
                        isActive(ROUTES.REPORTS.PURCHASES)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${sidebarCollapsed ? 'text-xs' : ''}`}
                      title="Purchases Report"
                    >
                      {sidebarCollapsed ? (
                        <div className="flex flex-col items-center">
                          <FiCreditCard size={14} className="mb-1" />
                          <span>Purch</span>
                        </div>
                      ) : (
                        'Purchases Report'
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.REPORTS.GST}
                      className={`block px-2 py-2 rounded-md ${
                        isActive(ROUTES.REPORTS.GST)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${sidebarCollapsed ? 'text-xs' : ''}`}
                      title="GST Report"
                    >
                      {sidebarCollapsed ? (
                        <div className="flex flex-col items-center">
                          <FiFileText size={14} className="mb-1" />
                          <span>GST</span>
                        </div>
                      ) : (
                        'GST Report'
                      )}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.REPORTS.INVENTORY}
                      className={`block px-2 py-2 rounded-md ${
                        isActive(ROUTES.REPORTS.INVENTORY)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      } ${sidebarCollapsed ? 'text-xs' : ''}`}
                      title="Inventory Report"
                    >
                      {sidebarCollapsed ? (
                        <div className="flex flex-col items-center">
                          <FiPackage size={14} className="mb-1" />
                          <span>Inv</span>
                        </div>
                      ) : (
                        'Inventory Report'
                      )}
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* OCR */}
            <li>
              <Link
                to={ROUTES.OCR.SCAN}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-4 py-2 rounded-md ${
                  isActiveGroup([ROUTES.OCR.SCAN, ROUTES.OCR.HISTORY])
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title="OCR Scan"
              >
                <FiCamera className={sidebarCollapsed ? '' : 'mr-3'} size={18} />
                {!sidebarCollapsed && <span>OCR Scan</span>}
              </Link>
            </li>

            {/* Speech */}
            <li>
              <Link
                to={ROUTES.SPEECH.RECOGNIZE}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-4 py-2 rounded-md ${
                  isActive(ROUTES.SPEECH.RECOGNIZE)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title="Speech Recognition"
              >
                <FiMic className={sidebarCollapsed ? '' : 'mr-3'} size={18} />
                {!sidebarCollapsed && <span>Speech Recognition</span>}
              </Link>
            </li>

            {/* Admin only: Users */}
            {user?.role === 'admin' && (
              <li>
                <Link
                  to={ROUTES.USERS}
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-4 py-2 rounded-md ${
                    isActive(ROUTES.USERS)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Users"
                >
                  <FiUsers className={sidebarCollapsed ? '' : 'mr-3'} size={18} />
                  {!sidebarCollapsed && <span>Users</span>}
                </Link>
              </li>
            )}

            {/* Admin only: Backup */}
            {user?.role === 'admin' && (
              <li>
                <Link
                  to={ROUTES.BACKUP.LIST}
                  className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-4 py-2 rounded-md ${
                    isActiveGroup([ROUTES.BACKUP.LIST, ROUTES.BACKUP.RESTORE])
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  title="Backup & Restore"
                >
                  <FiDatabase className={sidebarCollapsed ? '' : 'mr-3'} size={18} />
                  {!sidebarCollapsed && <span>Backup & Restore</span>}
                </Link>
              </li>
            )}

            {/* Settings */}
            <li>
              <Link
                to={ROUTES.SETTINGS}
                className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''} px-4 py-2 rounded-md ${
                  isActive(ROUTES.SETTINGS)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title="Settings"
              >
                <FiSettings className={sidebarCollapsed ? '' : 'mr-3'} size={18} />
                {!sidebarCollapsed && <span>Settings</span>}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main content */}
      <div className={`flex-1 flex flex-col ${sidebarCollapsed ? 'md:ml-20' : 'md:ml-60'} transition-all duration-300`}>
        {/* Header */}

        {/* Page content */}
        <main className="flex-1 overflow-y-auto mt-10 pb-2">
          {children}
        </main>
      </div>
    </div>
    </div>
  );
};

export default MainLayout;