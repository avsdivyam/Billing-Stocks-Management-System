import { jwtDecode } from 'jwt-decode';

/**
 * Utility functions for authentication and token handling
 */

/**
 * Check if a JWT token is valid and not expired
 * 
 * @param {string} token JWT token to validate
 * @param {number} [expiryThreshold=300] Seconds before actual expiry to consider token expired (default: 5 minutes)
 * @returns {boolean} Whether the token is valid and not expired
 */
export const isTokenValid = (token, expiryThreshold = 300) => {
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token has expiry and is not expired
    if (!decoded.exp) return false;
    
    // Consider token expired if within threshold of actual expiry
    return decoded.exp > currentTime + expiryThreshold;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};

/**
 * Get the payload from a JWT token
 * 
 * @param {string} token JWT token to decode
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export const getTokenPayload = (token) => {
  if (!token) return null;
  
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Get the expiration time of a JWT token
 * 
 * @param {string} token JWT token
 * @returns {number|null} Expiration timestamp in seconds or null if invalid
 */
export const getTokenExpiration = (token) => {
  const payload = getTokenPayload(token);
  return payload?.exp || null;
};

/**
 * Get the remaining time until token expiration
 * 
 * @param {string} token JWT token
 * @returns {number} Seconds until expiration (negative if expired)
 */
export const getTokenRemainingTime = (token) => {
  const expiration = getTokenExpiration(token);
  if (!expiration) return 0;
  
  const currentTime = Date.now() / 1000;
  return expiration - currentTime;
};

/**
 * Check if user has required role
 * 
 * @param {Object} user User object
 * @param {string|string[]} requiredRoles Required role(s)
 * @returns {boolean} Whether user has required role
 */
export const hasRole = (user, requiredRoles) => {
  if (!user || !user.role) return false;
  
  // Admin has all permissions
  if (user.role === 'admin') return true;
  
  // Check if user has one of the required roles
  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(user.role);
  }
  
  // Check single role
  return user.role === requiredRoles;
};