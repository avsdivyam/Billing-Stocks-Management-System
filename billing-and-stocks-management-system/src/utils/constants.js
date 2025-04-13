// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  OWNER: 'owner',
  STAFF: 'staff',
};

// Payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIAL: 'partial',
  PAID: 'paid',
};

// Payment methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CREDIT: 'credit',
  UPI: 'upi',
  CARD: 'card',
  BANK_TRANSFER: 'bank_transfer',
};

// GST rates
export const GST_RATES = [
  { value: 0, label: '0%' },
  { value: 5, label: '5%' },
  { value: 12, label: '12%' },
  { value: 18, label: '18%' },
  { value: 28, label: '28%' },
];

// Report types
export const REPORT_TYPES = {
  DAILY: 'daily',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

// Report formats
export const REPORT_FORMATS = {
  JSON: 'json',
  EXCEL: 'excel',
  CSV: 'csv',
};

// OCR scan types
export const OCR_SCAN_TYPES = {
  BILL: 'bill',
  INVOICE: 'invoice',
  RECEIPT: 'receipt',
};

// OCR methods
export const OCR_METHODS = {
  TESSERACT: 'tesseract',
  GOOGLE: 'google',
};

// Backup types
export const BACKUP_TYPES = {
  MANUAL: 'manual',
  SCHEDULED: 'scheduled',
  PRE_RESTORE: 'pre_restore',
};

// Pagination options
export const PAGINATION_OPTIONS = [
  { value: 10, label: '10 per page' },
  { value: 25, label: '25 per page' },
  { value: 50, label: '50 per page' },
  { value: 100, label: '100 per page' },
];

// Chart colors
export const CHART_COLORS = [
  '#0ea5e9', // primary-500
  '#8b5cf6', // secondary-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#6366f1', // indigo-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
  '#8b5cf6', // violet-500
];

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  INPUT: 'yyyy-MM-dd',
  DISPLAY_WITH_TIME: 'dd/MM/yyyy HH:mm',
  API: 'yyyy-MM-dd',
};

// Routes
export const ROUTES = {
  HOME: '/',
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  // Main routes
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  USERS: '/users',
  VENDORS: '/vendors',
  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    SETTINGS: '/admin/settings',
    BACKUP: '/admin/backup',
  },
  // Inventory routes
  INVENTORY: {
    CATEGORIES: '/inventory/categories',
    PRODUCTS: '/inventory/products',
    LOW_STOCK: '/inventory/low-stock',
    BARCODES: '/inventory/barcodes',
  },
  // Billing routes
  BILLING: {
    CUSTOMERS: '/billing/customers',
    SALES: '/billing/sales',
    NEW_SALE: '/billing/sales/new',
    EDIT_SALE: '/billing/sales/edit',
    PURCHASES: '/billing/purchases',
    NEW_PURCHASE: '/billing/purchases/new',
    EDIT_PURCHASE: '/billing/purchases/edit',
  },
  
  // Repair routes
  REPAIR: {
    SERVICES: '/repair/services',
    NEW_SERVICE: '/repair/services/new',
    EDIT_SERVICE: '/repair/services/edit',
    INVOICE: '/repair/services/invoice',
  },
  // Report routes
  REPORTS: {
    SALES: '/reports/sales',
    PURCHASES: '/reports/purchases',
    GST: '/reports/gst',
    INVENTORY: '/reports/inventory',
  },
  // OCR routes
  OCR: {
    SCAN: '/ocr/scan',
    HISTORY: '/ocr/history',
  },
  // Speech routes
  SPEECH: {
    RECOGNIZE: '/speech/recognize',
  },
  // Backup routes
  BACKUP: {
    LIST: '/backup',
    RESTORE: '/backup/restore',
  },
  SETTINGS: '/settings',
};