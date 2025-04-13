import React, { useState, useEffect, useMemo } from 'react';
import { FiDownload, FiPrinter, FiFilter, FiBarChart2, FiPieChart, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { Card, Button, Input, Table, Select } from '../../components/ui';
import { ROUTES, REPORT_TYPES, REPORT_FORMATS } from '../../utils/constants';
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';
import { motion } from 'framer-motion';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Mock API service for sales report data
const fetchSalesReport = (startDate, endDate, reportType) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate mock data based on date range and report type
      const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
      const isMonthly = reportType === REPORT_TYPES.MONTHLY;
      const isYearly = reportType === REPORT_TYPES.YEARLY;
      
      let salesData = [];
      let currentDate = new Date(startDate);
      
      if (isMonthly) {
        // Generate monthly data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        for (let i = 0; i < 12; i++) {
          salesData.push({
            period: months[i],
            sales: Math.floor(10000 + Math.random() * 50000),
            orders: Math.floor(50 + Math.random() * 200),
            avgOrderValue: Math.floor(500 + Math.random() * 1500),
            returns: Math.floor(Math.random() * 20),
          });
        }
      } else if (isYearly) {
        // Generate yearly data
        const currentYear = new Date().getFullYear();
        for (let i = 0; i < 5; i++) {
          const year = currentYear - 4 + i;
          salesData.push({
            period: year.toString(),
            sales: Math.floor(100000 + Math.random() * 500000),
            orders: Math.floor(500 + Math.random() * 2000),
            avgOrderValue: Math.floor(500 + Math.random() * 1500),
            returns: Math.floor(10 + Math.random() * 100),
          });
        }
      } else {
        // Generate daily data
        for (let i = 0; i < days; i++) {
          const date = new Date(currentDate);
          salesData.push({
            period: format(date, 'dd MMM'),
            date: format(date, 'yyyy-MM-dd'),
            sales: Math.floor(1000 + Math.random() * 10000),
            orders: Math.floor(5 + Math.random() * 30),
            avgOrderValue: Math.floor(500 + Math.random() * 1500),
            returns: Math.floor(Math.random() * 5),
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
      
      // Calculate summary data
      const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
      const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
      const totalReturns = salesData.reduce((sum, item) => sum + item.returns, 0);
      const avgOrderValue = totalSales / totalOrders;
      
      // Generate top products data
      const topProducts = [
        { name: 'Product A', sales: 25600, percentage: 18 },
        { name: 'Product B', sales: 19800, percentage: 14 },
        { name: 'Product C', sales: 15400, percentage: 11 },
        { name: 'Product D', sales: 12200, percentage: 9 },
        { name: 'Product E', sales: 9800, percentage: 7 },
      ];
      
      // Generate payment methods data
      const paymentMethods = [
        { method: 'Cash', amount: totalSales * 0.3, percentage: 30 },
        { method: 'UPI', amount: totalSales * 0.25, percentage: 25 },
        { method: 'Card', amount: totalSales * 0.2, percentage: 20 },
        { method: 'Bank Transfer', amount: totalSales * 0.15, percentage: 15 },
        { method: 'Credit', amount: totalSales * 0.1, percentage: 10 },
      ];
      
      resolve({
        salesData,
        summary: {
          totalSales,
          totalOrders,
          totalReturns,
          avgOrderValue,
          returnRate: (totalReturns / totalOrders) * 100,
        },
        topProducts,
        paymentMethods,
      });
    }, 1000);
  });
};

const SalesReport = () => {
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState(REPORT_TYPES.DAILY);
  const [startDate, setStartDate] = useState(format(subDays(new Date(), 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [reportData, setReportData] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const [exportFormat, setExportFormat] = useState(REPORT_FORMATS.PDF);

  // Fetch report data when date range or report type changes
  useEffect(() => {
    const loadReportData = async () => {
      setLoading(true);
      try {
        const data = await fetchSalesReport(startDate, endDate, reportType);
        setReportData(data);
      } catch (error) {
        console.error('Error fetching sales report:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, [startDate, endDate, reportType]);

  // Handle date range presets
  const handleDateRangePreset = (preset) => {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    
    switch (preset) {
      case 'today':
        setStartDate(format(today, 'yyyy-MM-dd'));
        setEndDate(format(today, 'yyyy-MM-dd'));
        setReportType(REPORT_TYPES.DAILY);
        break;
      case 'yesterday':
        setStartDate(format(yesterday, 'yyyy-MM-dd'));
        setEndDate(format(yesterday, 'yyyy-MM-dd'));
        setReportType(REPORT_TYPES.DAILY);
        break;
      case 'last7days':
        setStartDate(format(subDays(today, 6), 'yyyy-MM-dd'));
        setEndDate(format(today, 'yyyy-MM-dd'));
        setReportType(REPORT_TYPES.DAILY);
        break;
      case 'last30days':
        setStartDate(format(subDays(today, 29), 'yyyy-MM-dd'));
        setEndDate(format(today, 'yyyy-MM-dd'));
        setReportType(REPORT_TYPES.DAILY);
        break;
      case 'thisMonth':
        setStartDate(format(startOfMonth(today), 'yyyy-MM-dd'));
        setEndDate(format(endOfMonth(today), 'yyyy-MM-dd'));
        setReportType(REPORT_TYPES.DAILY);
        break;
      case 'lastMonth':
        setStartDate(format(startOfMonth(lastMonth), 'yyyy-MM-dd'));
        setEndDate(format(endOfMonth(lastMonth), 'yyyy-MM-dd'));
        setReportType(REPORT_TYPES.DAILY);
        break;
      case 'thisYear':
        setStartDate(format(startOfYear(today), 'yyyy-MM-dd'));
        setEndDate(format(endOfYear(today), 'yyyy-MM-dd'));
        setReportType(REPORT_TYPES.MONTHLY);
        break;
      default:
        break;
    }
  };

  // Handle export report
  const handleExportReport = () => {
    // In a real app, you would implement export functionality
    alert(`Exporting report in ${exportFormat} format`);
  };

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!reportData) return null;
    
    return {
      labels: reportData.salesData.map(item => item.period),
      datasets: [
        {
          label: 'Sales (₹)',
          data: reportData.salesData.map(item => item.sales),
          backgroundColor: 'rgba(14, 165, 233, 0.7)',
          borderColor: 'rgba(14, 165, 233, 1)',
          borderWidth: 1,
        }
      ]
    };
  }, [reportData]);

  // Prepare pie chart data for payment methods
  const paymentMethodsChartData = useMemo(() => {
    if (!reportData) return null;
    
    return {
      labels: reportData.paymentMethods.map(item => item.method),
      datasets: [
        {
          data: reportData.paymentMethods.map(item => item.percentage),
          backgroundColor: [
            'rgba(14, 165, 233, 0.7)',
            'rgba(20, 184, 166, 0.7)',
            'rgba(34, 197, 94, 0.7)',
            'rgba(249, 115, 22, 0.7)',
            'rgba(239, 68, 68, 0.7)',
          ],
          borderColor: [
            'rgba(14, 165, 233, 1)',
            'rgba(20, 184, 166, 1)',
            'rgba(34, 197, 94, 1)',
            'rgba(249, 115, 22, 1)',
            'rgba(239, 68, 68, 1)',
          ],
          borderWidth: 1,
        }
      ]
    };
  }, [reportData]);

  // Prepare line chart data for orders
  const ordersChartData = useMemo(() => {
    if (!reportData) return null;
    
    return {
      labels: reportData.salesData.map(item => item.period),
      datasets: [
        {
          label: 'Orders',
          data: reportData.salesData.map(item => item.orders),
          backgroundColor: 'rgba(20, 184, 166, 0.2)',
          borderColor: 'rgba(20, 184, 166, 1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
        }
      ]
    };
  }, [reportData]);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales Performance',
        font: {
          size: 16,
        }
      },
    },
  };

  // Pie chart options
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Payment Methods',
        font: {
          size: 16,
        }
      },
    },
  };

  // Line chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Order Trends',
        font: {
          size: 16,
        }
      },
    },
  };

  // Table columns for sales data
  const columns = useMemo(() => [
    {
      Header: 'Period',
      accessor: 'period',
    },
    {
      Header: 'Sales',
      accessor: 'sales',
      Cell: ({ value }) => `₹${value.toLocaleString()}`
    },
    {
      Header: 'Orders',
      accessor: 'orders',
    },
    {
      Header: 'Avg. Order Value',
      accessor: 'avgOrderValue',
      Cell: ({ value }) => `₹${value.toLocaleString()}`
    },
    {
      Header: 'Returns',
      accessor: 'returns',
    },
  ], []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 24
      }
    }
  };

  if (loading && !reportData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading report data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Page header */}
      <motion.div variants={itemVariants}>
        <Card className='text-start'>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Sales Report</h1>
              <p className="mt-1 text-gray-600">
                Analyze your sales performance and trends
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <option value={REPORT_FORMATS.PDF}>PDF</option>
                <option value={REPORT_FORMATS.EXCEL}>Excel</option>
                <option value={REPORT_FORMATS.CSV}>CSV</option>
              </select>
              <Button variant="outline" size="sm" onClick={handleExportReport}>
                <FiDownload className="mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <FiPrinter className="mr-2" />
                Print
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report Type
                </label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <option value={REPORT_TYPES.DAILY}>Daily</option>
                  <option value={REPORT_TYPES.MONTHLY}>Monthly</option>
                  <option value={REPORT_TYPES.YEARLY}>Yearly</option>
                </select>
              </div>
              
              <div className="w-full md:w-1/4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  max={endDate}
                />
              </div>
              
              <div className="w-full md:w-1/4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                />
              </div>
              
              <div className="w-full md:w-1/4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chart Type
                </label>
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                >
                  <option value="bar">Bar Chart</option>
                  <option value="line">Line Chart</option>
                </select>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 sales-report">
              <Button size="xs" variant="outline" onClick={() => handleDateRangePreset('today')}>
                Today
              </Button>
              <Button size="xs" variant="outline" onClick={() => handleDateRangePreset('yesterday')}>
                Yesterday
              </Button>
              <Button size="xs" variant="outline" onClick={() => handleDateRangePreset('last7days')}>
                Last 7 Days
              </Button>
              <Button size="xs" variant="outline" onClick={() => handleDateRangePreset('last30days')}>
                Last 30 Days
              </Button>
              <Button size="xs" variant="outline" onClick={() => handleDateRangePreset('thisMonth')}>
                This Month
              </Button>
              <Button size="xs" variant="outline" onClick={() => handleDateRangePreset('lastMonth')}>
                Last Month
              </Button>
              <Button size="xs" variant="outline" onClick={() => handleDateRangePreset('thisYear')}>
                This Year
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Summary cards */}
      {reportData && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <motion.div variants={itemVariants} className="md:col-span-1">
            <Card className="h-full text-start">
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                  <FiDollarSign size={24} />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-500">Total Sales</p>
                <p className="text-2xl font-semibold text-gray-800">₹{reportData.summary.totalSales.toLocaleString()}</p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-1">
            <Card className="h-full">
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-secondary-100 text-secondary-600">
                  <FiShoppingBag size={24} />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-800">{reportData.summary.totalOrders.toLocaleString()}</p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-1">
            <Card className="h-full">
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-success-100 text-success-600">
                  <FiTrendingUp size={24} />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-500">Avg. Order Value</p>
                <p className="text-2xl font-semibold text-gray-800">₹{reportData.summary.avgOrderValue.toFixed(2)}</p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-1">
            <Card className="h-full">
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-warning-100 text-warning-600">
                  <FiRefreshCw size={24} />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-500">Returns</p>
                <p className="text-2xl font-semibold text-gray-800">{reportData.summary.totalReturns}</p>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-1">
            <Card className="h-full">
              <div className="flex flex-col items-center">
                <div className="p-3 rounded-full bg-danger-100 text-danger-600">
                  <FiPercent size={24} />
                </div>
                <p className="mt-2 text-sm font-medium text-gray-500">Return Rate</p>
                <p className="text-2xl font-semibold text-gray-800">{reportData.summary.returnRate.toFixed(2)}%</p>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Charts */}
      {reportData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={itemVariants}>
            <Card>
              <h2 className="text-lg font-semibold mb-4">Sales Performance</h2>
              <div className="h-80">
                {chartType === 'bar' ? (
                  <Bar data={chartData} options={chartOptions} />
                ) : (
                  <Line data={chartData} options={chartOptions} />
                )}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <h2 className="text-lg font-semibold mb-4">Order Trends</h2>
              <div className="h-80">
                <Line data={ordersChartData} options={lineChartOptions} />
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <h2 className="text-lg font-semibold mb-4">Payment Methods</h2>
              <div className="h-80">
                <Pie data={paymentMethodsChartData} options={pieChartOptions} />
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <h2 className="text-lg font-semibold mb-4">Top Products</h2>
              <div className="overflow-y-auto max-h-80">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sales
                      </th>
                      <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reportData.topProducts.map((product, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                          ₹{product.sales.toLocaleString()}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900 text-right">
                          {product.percentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Detailed data table */}
      {reportData && (
        <motion.div variants={itemVariants}>
          <Card>
            <h2 className="text-lg font-semibold mb-4">Detailed Sales Data</h2>
            <Table
              columns={columns}
              data={reportData.salesData}
              sortable
              pagination
            />
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

// Add missing icon components
const FiDollarSign = (props) => <FiTrendingUp {...props} />;
const FiShoppingBag = (props) => <FiBarChart2 {...props} />;
const FiRefreshCw = (props) => <FiFilter {...props} />;
const FiPercent = (props) => <FiPieChart {...props} />;

export default SalesReport;