import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../utils/constants';

// Import icons
import { 
  FiPackage, FiShoppingBag, FiUsers, FiDollarSign, 
  FiAlertCircle, FiTrendingUp, FiTrendingDown, FiActivity 
} from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockProducts: 0,
    totalSales: 0,
    totalPurchases: 0,
    totalCustomers: 0,
    totalVendors: 0,
    recentSales: [],
    recentPurchases: [],
    salesTrend: [],
    purchasesTrend: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching dashboard data
    const fetchDashboardData = async () => {
      try {
        // In a real app, you would fetch this data from your API
        // For now, we'll use mock data
        setTimeout(() => {
          setStats({
            totalProducts: 156,
            lowStockProducts: 12,
            totalSales: 45,
            totalPurchases: 23,
            totalCustomers: 78,
            totalVendors: 34,
            recentSales: [
              { id: 1, invoice: 'INV-001', customer: 'John Doe', amount: 1250, date: '2023-05-15' },
              { id: 2, invoice: 'INV-002', customer: 'Jane Smith', amount: 850, date: '2023-05-14' },
              { id: 3, invoice: 'INV-003', customer: 'Robert Johnson', amount: 2100, date: '2023-05-13' },
              { id: 4, invoice: 'INV-004', customer: 'Emily Davis', amount: 1500, date: '2023-05-12' },
            ],
            recentPurchases: [
              { id: 1, reference: 'PO-001', vendor: 'ABC Supplies', amount: 3500, date: '2023-05-15' },
              { id: 2, reference: 'PO-002', vendor: 'XYZ Distributors', amount: 2800, date: '2023-05-13' },
              { id: 3, reference: 'PO-003', vendor: 'Global Traders', amount: 1950, date: '2023-05-10' },
            ],
            salesTrend: [
              { month: 'Jan', amount: 12500 },
              { month: 'Feb', amount: 15000 },
              { month: 'Mar', amount: 18000 },
              { month: 'Apr', amount: 16500 },
              { month: 'May', amount: 21000 },
            ],
            purchasesTrend: [
              { month: 'Jan', amount: 10000 },
              { month: 'Feb', amount: 12000 },
              { month: 'Mar', amount: 14500 },
              { month: 'Apr', amount: 13000 },
              { month: 'May', amount: 16000 },
            ]
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome message */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.full_name || user?.username}!</h1>
        <p className="mt-2 text-gray-600">
          Here's an overview of your business performance and key metrics.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-500">
              <FiPackage size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalProducts}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to={ROUTES.INVENTORY.PRODUCTS} className="text-sm text-primary-600 hover:text-primary-800">
              View all products →
            </Link>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-500">
              <FiAlertCircle size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Low Stock Items</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.lowStockProducts}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to={ROUTES.INVENTORY.LOW_STOCK} className="text-sm text-primary-600 hover:text-primary-800">
              View low stock items →
            </Link>
          </div>
        </div>

        {/* Sales */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-500">
              <FiTrendingUp size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalSales}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to={ROUTES.BILLING.SALES} className="text-sm text-primary-600 hover:text-primary-800">
              View all sales →
            </Link>
          </div>
        </div>

        {/* Purchases */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-500">
              <FiShoppingBag size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Purchases</p>
              <p className="text-2xl font-semibold text-gray-800">{stats.totalPurchases}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link to={ROUTES.BILLING.PURCHASES} className="text-sm text-primary-600 hover:text-primary-800">
              View all purchases →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Recent Sales</h2>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invoice
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentSales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {sale.invoice}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {sale.customer}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        ₹{sale.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {new Date(sale.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <Link to={ROUTES.BILLING.SALES} className="text-sm text-primary-600 hover:text-primary-800">
                View all sales →
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Purchases */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Recent Purchases</h2>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vendor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentPurchases.map((purchase) => (
                    <tr key={purchase.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {purchase.reference}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {purchase.vendor}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        ₹{purchase.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                        {new Date(purchase.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <Link to={ROUTES.BILLING.PURCHASES} className="text-sm text-primary-600 hover:text-primary-800">
                View all purchases →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to={ROUTES.BILLING.NEW_SALE}
            className="flex flex-col items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
          >
            <FiDollarSign size={24} className="text-primary-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">New Sale</span>
          </Link>
          
          <Link
            to={ROUTES.BILLING.NEW_PURCHASE}
            className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <FiShoppingBag size={24} className="text-purple-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">New Purchase</span>
          </Link>
          
          <Link
            to={ROUTES.INVENTORY.PRODUCTS}
            className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <FiPackage size={24} className="text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Add Product</span>
          </Link>
          
          <Link
            to={ROUTES.REPORTS.SALES}
            className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <FiActivity size={24} className="text-green-600 mb-2" />
            <span className="text-sm font-medium text-gray-700">Sales Report</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;