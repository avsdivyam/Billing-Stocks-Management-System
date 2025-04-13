import React from 'react';
import PropTypes from 'prop-types';

/**
 * Card component for displaying content in a contained box
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.title] - Card title
 * @param {React.ReactNode} [props.action] - Action element to display in the header (e.g., button)
 * @param {boolean} [props.noPadding=false] - Whether to remove padding from the card body
 * @param {string} [props.className] - Additional CSS classes for the card
 * @param {string} [props.headerClassName] - Additional CSS classes for the card header
 * @param {string} [props.bodyClassName] - Additional CSS classes for the card body
 */
const Card = ({
  children,
  title,
  action,
  noPadding = false,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  ...rest
}) => {
  // Base card classes
  const cardClasses = `bg-white rounded-card shadow-card hover:shadow-card-hover transition-shadow ${className}`;
  
  // Header classes
  const headerClasses = `px-6 py-4 border-b border-gray-200 ${headerClassName}`;
  
  // Body classes
  const bodyClasses = `${noPadding ? '' : 'p-6'} ${bodyClassName}`;
  
  return (
    <div className={cardClasses} {...rest}>
      {/* Render header if title or action is provided */}
      {(title || action) && (
        <div className={headerClasses}>
          <div className="flex items-center justify-between">
            {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
            {action && <div>{action}</div>}
          </div>
        </div>
      )}
      
      {/* Card body */}
      <div className={bodyClasses}>
        {children}
      </div>
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  action: PropTypes.node,
  noPadding: PropTypes.bool,
  className: PropTypes.string,
  headerClassName: PropTypes.string,
  bodyClassName: PropTypes.string,
};

export default Card;