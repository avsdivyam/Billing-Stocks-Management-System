import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';

/**
 * Select component based on react-select
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Select ID
 * @param {string} props.name - Select name
 * @param {string} [props.label] - Select label
 * @param {Array} props.options - Select options array of objects with value and label
 * @param {Object|Array} [props.value] - Selected value(s)
 * @param {Function} [props.onChange] - Change handler
 * @param {Function} [props.onBlur] - Blur handler
 * @param {boolean} [props.isMulti=false] - Whether multiple options can be selected
 * @param {boolean} [props.isClearable=false] - Whether the select can be cleared
 * @param {boolean} [props.isSearchable=true] - Whether the select is searchable
 * @param {boolean} [props.disabled=false] - Whether the select is disabled
 * @param {boolean} [props.required=false] - Whether the select is required
 * @param {string} [props.error] - Error message
 * @param {string} [props.helperText] - Helper text
 * @param {string} [props.placeholder='Select...'] - Placeholder text
 * @param {string} [props.className] - Additional CSS classes
 */
const Select = forwardRef(({
  id,
  name,
  label,
  options,
  value,
  onChange,
  onBlur,
  isMulti = false,
  isClearable = false,
  isSearchable = true,
  disabled = false,
  required = false,
  error,
  helperText,
  placeholder = 'Select...',
  className = '',
  ...rest
}, ref) => {
  // Custom styles for react-select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: error ? '#fca5a5' : state.isFocused ? '#6366f1' : '#d1d5db',
      boxShadow: state.isFocused ? (error ? '0 0 0 1px #ef4444' : '0 0 0 1px #6366f1') : 'none',
      '&:hover': {
        borderColor: error ? '#f87171' : '#6366f1',
      },
      backgroundColor: disabled ? '#f3f4f6' : '#ffffff',
      borderRadius: '0.375rem',
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: '0.375rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 50,
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? '#6366f1' 
        : state.isFocused 
          ? '#e0e7ff' 
          : 'transparent',
      color: state.isSelected ? '#ffffff' : '#111827',
      '&:active': {
        backgroundColor: state.isSelected ? '#4f46e5' : '#c7d2fe',
      },
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: '#e0e7ff',
      borderRadius: '0.25rem',
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: '#4338ca',
      fontWeight: 500,
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: '#4338ca',
      '&:hover': {
        backgroundColor: '#c7d2fe',
        color: '#312e81',
      },
    }),
    indicatorSeparator: (provided) => ({
      ...provided,
      backgroundColor: '#d1d5db',
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? '#6366f1' : '#6b7280',
    }),
    clearIndicator: (provided) => ({
      ...provided,
      color: '#6b7280',
      '&:hover': {
        color: '#ef4444',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af',
    }),
  };

  // Handle change
  const handleChange = (selectedOption) => {
    if (onChange) {
      onChange({
        target: {
          name,
          value: selectedOption,
        },
      });
    }
  };

  // Handle blur
  const handleBlur = () => {
    if (onBlur) {
      onBlur({
        target: {
          name,
        },
      });
    }
  };

  return (
    <div className={className}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Select component */}
      <ReactSelect
        inputId={id}
        name={name}
        ref={ref}
        options={options}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        isMulti={isMulti}
        isClearable={isClearable}
        isSearchable={isSearchable}
        isDisabled={disabled}
        placeholder={placeholder}
        styles={customStyles}
        classNamePrefix="select"
        {...rest}
      />
      
      {/* Error message */}
      {error && (
        <p className="mt-2 text-sm text-danger-600" id={`${id}-error`}>
          {error}
        </p>
      )}
      
      {/* Helper text */}
      {!error && helperText && (
        <p className="mt-2 text-sm text-gray-500" id={`${id}-helper`}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

Select.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  value: PropTypes.oneOfType([
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    }),
    PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string,
      })
    ),
  ]),
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  isMulti: PropTypes.bool,
  isClearable: PropTypes.bool,
  isSearchable: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  helperText: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
};

export default Select;