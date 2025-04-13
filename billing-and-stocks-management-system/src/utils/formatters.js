import { format, parseISO } from 'date-fns';

/**
 * Format a date string to a readable format
 * @param {string} dateString - ISO date string
 * @param {string} formatStr - Date format string
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString, formatStr = 'dd/MM/yyyy') => {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format a number as currency
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code
 * @param {string} locale - Locale for formatting
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = 'INR', locale = 'en-IN') => {
  if (amount === null || amount === undefined) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currency} ${amount}`;
  }
};

/**
 * Format a number with commas
 * @param {number} number - Number to format
 * @param {number} decimals - Number of decimal places
 * @param {string} locale - Locale for formatting
 * @returns {string} - Formatted number string
 */
export const formatNumber = (number, decimals = 2, locale = 'en-IN') => {
  if (number === null || number === undefined) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(number);
  } catch (error) {
    console.error('Error formatting number:', error);
    return String(number);
  }
};

/**
 * Format a percentage
 * @param {number} value - Value to format as percentage
 * @param {number} decimals - Number of decimal places
 * @param {string} locale - Locale for formatting
 * @returns {string} - Formatted percentage string
 */
export const formatPercentage = (value, decimals = 2, locale = 'en-IN') => {
  if (value === null || value === undefined) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value / 100);
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return `${value}%`;
  }
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format a phone number
 * @param {string} phone - Phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
  }
  
  return phone;
};

/**
 * Format GST number
 * @param {string} gst - GST number to format
 * @returns {string} - Formatted GST number
 */
export const formatGSTNumber = (gst) => {
  if (!gst) return '';
  
  // Remove spaces
  const cleaned = gst.replace(/\s/g, '');
  
  // Format as XX-XXXXX-XXXX
  if (cleaned.length === 15) {
    return `${cleaned.substring(0, 2)}-${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
  }
  
  return gst;
};