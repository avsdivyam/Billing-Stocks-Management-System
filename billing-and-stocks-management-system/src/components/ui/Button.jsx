import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { FiLoader } from 'react-icons/fi';

/**
 * Button component that can be rendered as a button or a link
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='primary'] - Button variant (primary, secondary, success, danger, warning, outline, ghost)
 * @param {string} [props.size='md'] - Button size (sm, md, lg)
 * @param {boolean} [props.loading=false] - Whether the button is in loading state
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {boolean} [props.fullWidth=false] - Whether the button should take full width
 * @param {string} [props.to] - If provided, button will be rendered as a Link to this path
 * @param {string} [props.href] - If provided, button will be rendered as an anchor tag
 * @param {string} [props.type='button'] - Button type (button, submit, reset)
 * @param {Function} [props.onClick] - Click handler
 * @param {React.ReactNode} props.children - Button content
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ReactNode} [props.leftIcon] - Icon to display on the left side
 * @param {React.ReactNode} [props.rightIcon] - Icon to display on the right side
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  to,
  href,
  type = 'button',
  onClick,
  children,
  className = '',
  leftIcon,
  rightIcon,
  isLoading, // For backward compatibility
  ...rest
}) => {
  // For backward compatibility
  loading = loading || isLoading;
  
  // Use our global CSS classes
  const buttonClasses = `
    btn btn-${variant} ${size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${loading ? 'opacity-60 cursor-not-allowed' : ''}
    ${className}
  `;
  
  // Content with optional loading spinner and icons
  const content = (
    <>
      {loading && (
        <FiLoader className="animate-spin mr-2" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      )}
      {leftIcon && !loading && (
        <span className="mr-2">{leftIcon}</span>
      )}
      {children}
      {rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </>
  );
  
  // Render as Link if 'to' prop is provided
  if (to) {
    return (
      <Link
        to={to}
        className={buttonClasses}
        {...rest}
      >
        {content}
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
        {content}
      </a>
    );
  }
  
  // Render as button
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {content}
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