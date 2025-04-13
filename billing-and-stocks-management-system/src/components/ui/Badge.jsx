import React from 'react';
import PropTypes from 'prop-types';

/**
 * Badge component for displaying status or labels
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='primary'] - Badge variant (primary, secondary, success, danger, warning, info, gray)
 * @param {string} [props.size='md'] - Badge size (sm, md, lg)
 * @param {boolean} [props.rounded=false] - Whether the badge has fully rounded corners
 * @param {boolean} [props.outline=false] - Whether the badge has an outline style
 * @param {React.ReactNode} props.children - Badge content
 * @param {string} [props.className] - Additional CSS classes
 */
const Badge = ({
  variant = 'primary',
  size = 'md',
  rounded = false,
  outline = false,
  children,
  className = '',
  ...rest
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center font-medium';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-sm',
  };
  
  // Rounded classes
  const roundedClasses = rounded ? 'rounded-full' : 'rounded';
  
  // Variant classes for solid badges
  const solidVariantClasses = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-success-100 text-success-800',
    danger: 'bg-danger-100 text-danger-800',
    warning: 'bg-warning-100 text-warning-800',
    info: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  
  // Variant classes for outline badges
  const outlineVariantClasses = {
    primary: 'bg-white text-primary-700 border border-primary-300',
    secondary: 'bg-white text-secondary-700 border border-secondary-300',
    success: 'bg-white text-success-700 border border-success-300',
    danger: 'bg-white text-danger-700 border border-danger-300',
    warning: 'bg-white text-warning-700 border border-warning-300',
    info: 'bg-white text-blue-700 border border-blue-300',
    gray: 'bg-white text-gray-700 border border-gray-300',
  };
  
  // Choose variant classes based on outline prop
  const variantClasses = outline ? outlineVariantClasses[variant] : solidVariantClasses[variant];
  
  // Combine all classes
  const badgeClasses = `${baseClasses} ${sizeClasses[size]} ${roundedClasses} ${variantClasses} ${className}`;
  
  return (
    <span className={badgeClasses} {...rest}>
      {children}
    </span>
  );
};

Badge.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'gray']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  rounded: PropTypes.bool,
  outline: PropTypes.bool,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Badge;