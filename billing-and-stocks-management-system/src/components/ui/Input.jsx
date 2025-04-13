import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * Input component for text input fields
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Input ID
 * @param {string} props.name - Input name
 * @param {string} [props.type='text'] - Input type
 * @param {string} [props.label] - Input label
 * @param {string} [props.placeholder] - Input placeholder
 * @param {string} [props.value] - Input value
 * @param {Function} [props.onChange] - Change handler
 * @param {Function} [props.onBlur] - Blur handler
 * @param {boolean} [props.disabled=false] - Whether the input is disabled
 * @param {boolean} [props.required=false] - Whether the input is required
 * @param {string} [props.error] - Error message
 * @param {string} [props.helperText] - Helper text
 * @param {React.ReactNode} [props.leftIcon] - Icon to display on the left
 * @param {React.ReactNode} [props.rightIcon] - Icon to display on the right
 * @param {string} [props.className] - Additional CSS classes
 */
const Input = forwardRef(({
  id,
  name,
  type = 'text',
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  ...rest
}, ref) => {
  // Use our global CSS classes
  const inputClasses = `
    form-input
    ${error ? 'error' : ''}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${className}
  `;
  
  return (
    <div className="form-group">
      {/* Label */}
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input container */}
      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            {leftIcon}
          </div>
        )}
        
        {/* Input element */}
        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...rest}
        />
        
        {/* Right icon */}
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-neutral-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <p className="form-error" id={`${id}-error`}>
          {error}
        </p>
      )}
      
      {/* Helper text */}
      {!error && helperText && (
        <p className="mt-2 text-sm text-neutral-500" id={`${id}-helper`}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
  leftIcon: PropTypes.node,
  rightIcon: PropTypes.node,
  className: PropTypes.string,
};

export default Input;