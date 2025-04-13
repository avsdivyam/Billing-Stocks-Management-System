import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Button component that can be rendered as a button or a link
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='primary'] - Button variant (primary, secondary, success, danger, warning, outline, ghost)
 * @param {string} [props.size='md'] - Button size (sm, md, lg)
 * @param {boolean} [props.isLoading=false] - Whether the button is in loading state
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {boolean} [props.fullWidth=false] - Whether the button should take full width
 * @param {string} [props.to] - If provided, button will be rendered as a Link to this path
 * @param {string} [props.href] - If provided, button will be rendered as an anchor tag
 * @param {string} [props.type='button'] - Button type (button, submit, reset)
 * @param {Function} [props.onClick] - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @param {string} [props.className] - Additional CSS classes
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  to,
  href,
  type = 'button',
  onClick,
  children,
  className = '',
  ...rest
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm rounded-button',
    md: 'px-4 py-2 text-sm rounded-button',
    lg: 'px-5 py-2.5 text-base rounded-button',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-button hover:shadow-button-hover',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-button hover:shadow-button-hover',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 shadow-button hover:shadow-button-hover',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 shadow-button hover:shadow-button-hover',
    warning: 'bg-warning-600 text-white hover:bg-warning-700 focus:ring-warning-500 shadow-button hover:shadow-button-hover',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-primary-500',
  };
  
  // Width classes
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Disabled classes
  const disabledClasses = disabled || isLoading ? 'opacity-60 cursor-not-allowed' : '';
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClasses} ${disabledClasses} ${className}`;
  
  // Loading spinner
  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
  
  // Render as Link if 'to' prop is provided
  if (to) {
    return (
      <Link
        to={to}
        className={buttonClasses}
        {...rest}
      >
        {isLoading && <LoadingSpinner />}
        {children}
      </Link>
    );
  }
  
  // Render as anchor if 'href' prop is provided
  if (href) {
    return (
      <a
        href={href}
        className={buttonClasses}
        {...rest}
      >
        {isLoading && <LoadingSpinner />}
        {children}
      </a>
    );
  }
  
  // Render as button
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...rest}
    >
      {isLoading && <LoadingSpinner />}
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  to: PropTypes.string,
  href: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Button;