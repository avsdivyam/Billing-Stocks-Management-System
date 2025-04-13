import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';

// Import icons
import { 
  FiMenu, FiX, FiHome, FiUser, FiUsers, FiShoppingBag, 
  FiPackage, FiFileText, FiCamera, FiMic, FiDatabase, 
  FiSettings, FiLogOut, FiChevronDown, FiChevronUp 
} from 'react-icons/fi';

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState({
    inventory: false,
    billing: false,
    reports: false,
  });

  // Toggle dropdown menu
  const toggleDropdown = (menu) => {
    setDropdowns((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
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
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Link to={ROUTES.DASHBOARD} className="flex items-center">
            <span className="text-xl font-semibold text-primary-600">Billing & Stocks</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md text-gray-500 hover:text-gray-700 md:hidden"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="py-4 overflow-y-auto">
          <ul className="space-y-1 px-2">
            {/* Dashboard */}
            <li>
              <Link
                to={ROUTES.DASHBOARD}
                className={`flex items-center px-4 py-2 rounded-md ${
                  isActive(ROUTES.DASHBOARD)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiHome className="mr-3" size={18} />
                <span>Dashboard</span>
              </Link>
            </li>

            {/* Inventory */}
            <li>
              <button
                onClick={() => toggleDropdown('inventory')}
                className={`flex items-center justify-between w-full px-4 py-2 rounded-md ${
                  isActiveGroup([ROUTES.INVENTORY.CATEGORIES, ROUTES.INVENTORY.PRODUCTS, ROUTES.INVENTORY.LOW_STOCK])
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <FiPackage className="mr-3" size={18} />
                  <span>Inventory</span>
                </div>
                {dropdowns.inventory ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </button>

              {dropdowns.inventory && (
                <ul className="pl-10 mt-1 space-y-1">
                  <li>
                    <Link
                      to={ROUTES.INVENTORY.CATEGORIES}
                      className={`block px-4 py-2 rounded-md ${
                        isActive(ROUTES.INVENTORY.CATEGORIES)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.INVENTORY.PRODUCTS}
                      className={`block px-4 py-2 rounded-md ${
                        isActive(ROUTES.INVENTORY.PRODUCTS)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.INVENTORY.LOW_STOCK}
                      className={`block px-4 py-2 rounded-md ${
                        isActive(ROUTES.INVENTORY.LOW_STOCK)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Low Stock
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Billing */}
            <li>
              <button
                onClick={() => toggleDropdown('billing')}
                className={`flex items-center justify-between w-full px-4 py-2 rounded-md ${
                  isActiveGroup([
                    ROUTES.BILLING.CUSTOMERS,
                    ROUTES.BILLING.SALES,
                    ROUTES.BILLING.PURCHASES,
                  ])
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <FiShoppingBag className="mr-3" size={18} />
                  <span>Billing</span>
                </div>
                {dropdowns.billing ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </button>

              {dropdowns.billing && (
                <ul className="pl-10 mt-1 space-y-1">
                  <li>
                    <Link
                      to={ROUTES.BILLING.CUSTOMERS}
                      className={`block px-4 py-2 rounded-md ${
                        isActive(ROUTES.BILLING.CUSTOMERS)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Customers
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.BILLING.SALES}
                      className={`block px-4 py-2 rounded-md ${
                        isActiveGroup([ROUTES.BILLING.SALES, ROUTES.BILLING.NEW_SALE, ROUTES.BILLING.EDIT_SALE])
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Sales
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.BILLING.PURCHASES}
                      className={`block px-4 py-2 rounded-md ${
                        isActiveGroup([ROUTES.BILLING.PURCHASES, ROUTES.BILLING.NEW_PURCHASE, ROUTES.BILLING.EDIT_PURCHASE])
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Purchases
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Reports */}
            <li>
              <button
                onClick={() => toggleDropdown('reports')}
                className={`flex items-center justify-between w-full px-4 py-2 rounded-md ${
                  isActiveGroup([
                    ROUTES.REPORTS.SALES,
                    ROUTES.REPORTS.PURCHASES,
                    ROUTES.REPORTS.GST,
                    ROUTES.REPORTS.INVENTORY,
                  ])
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center">
                  <FiFileText className="mr-3" size={18} />
                  <span>Reports</span>
                </div>
                {dropdowns.reports ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </button>

              {dropdowns.reports && (
                <ul className="pl-10 mt-1 space-y-1">
                  <li>
                    <Link
                      to={ROUTES.REPORTS.SALES}
                      className={`block px-4 py-2 rounded-md ${
                        isActive(ROUTES.REPORTS.SALES)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Sales Report
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.REPORTS.PURCHASES}
                      className={`block px-4 py-2 rounded-md ${
                        isActive(ROUTES.REPORTS.PURCHASES)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Purchases Report
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.REPORTS.GST}
                      className={`block px-4 py-2 rounded-md ${
                        isActive(ROUTES.REPORTS.GST)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      GST Report
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.REPORTS.INVENTORY}
                      className={`block px-4 py-2 rounded-md ${
                        isActive(ROUTES.REPORTS.INVENTORY)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      Inventory Report
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* OCR */}
            <li>
              <Link
                to={ROUTES.OCR.SCAN}
                className={`flex items-center px-4 py-2 rounded-md ${
                  isActiveGroup([ROUTES.OCR.SCAN, ROUTES.OCR.HISTORY])
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiCamera className="mr-3" size={18} />
                <span>OCR Scan</span>
              </Link>
            </li>

            {/* Speech */}
            <li>
              <Link
                to={ROUTES.SPEECH.RECOGNIZE}
                className={`flex items-center px-4 py-2 rounded-md ${
                  isActive(ROUTES.SPEECH.RECOGNIZE)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiMic className="mr-3" size={18} />
                <span>Speech Recognition</span>
              </Link>
            </li>

            {/* Admin only: Users */}
            {user?.role === 'admin' && (
              <li>
                <Link
                  to={ROUTES.USERS}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    isActive(ROUTES.USERS)
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FiUsers className="mr-3" size={18} />
                  <span>Users</span>
                </Link>
              </li>
            )}

            {/* Admin only: Backup */}
            {user?.role === 'admin' && (
              <li>
                <Link
                  to={ROUTES.BACKUP.LIST}
                  className={`flex items-center px-4 py-2 rounded-md ${
                    isActiveGroup([ROUTES.BACKUP.LIST, ROUTES.BACKUP.RESTORE])
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FiDatabase className="mr-3" size={18} />
                  <span>Backup & Restore</span>
                </Link>
              </li>
            )}

            {/* Settings */}
            <li>
              <Link
                to={ROUTES.SETTINGS}
                className={`flex items-center px-4 py-2 rounded-md ${
                  isActive(ROUTES.SETTINGS)
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiSettings className="mr-3" size={18} />
                <span>Settings</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring md:hidden"
            >
              <FiMenu size={24} />
            </button>

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

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;