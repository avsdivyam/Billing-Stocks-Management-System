/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether phone number is valid
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone.replace(/\D/g, ''));
};

/**
 * Validate GST number format
 * @param {string} gst - GST number to validate
 * @returns {boolean} - Whether GST number is valid
 */
export const isValidGST = (gst) => {
  if (!gst) return false;
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstRegex.test(gst.replace(/\s/g, ''));
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} - Whether password is strong enough
 */
export const isStrongPassword = (password) => {
  if (!password) return false;
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate form fields
 * @param {Object} values - Form values
 * @param {Array} requiredFields - Required field names
 * @returns {Object} - Validation errors
 */
export const validateForm = (values, requiredFields = []) => {
  const errors = {};

  // Check required fields
  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = 'This field is required';
    }
  });

  // Validate email if present
  if (values.email && !isValidEmail(values.email)) {
    errors.email = 'Invalid email address';
  }

  // Validate phone if present
  if (values.phone && !isValidPhone(values.phone)) {
    errors.phone = 'Invalid phone number';
  }

  // Validate GST number if present
  if (values.gst_number && !isValidGST(values.gst_number)) {
    errors.gst_number = 'Invalid GST number';
  }

  // Validate password if present
  if (values.password && !isStrongPassword(values.password)) {
    errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
  }

  // Validate password confirmation if present
  if (values.password_confirm && values.password !== values.password_confirm) {
    errors.password_confirm = 'Passwords do not match';
  }

  return errors;
};

/**
 * Validate numeric value
 * @param {string|number} value - Value to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {boolean} - Whether value is valid
 */
export const isValidNumber = (value, min = null, max = null) => {
  if (value === null || value === undefined || value === '') return false;
  
  const num = Number(value);
  if (isNaN(num)) return false;
  
  if (min !== null && num < min) return false;
  if (max !== null && num > max) return false;
  
  return true;
};

/**
 * Validate date format
 * @param {string} dateString - Date string to validate
 * @returns {boolean} - Whether date is valid
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};