import { useState, useCallback } from 'react';

/**
 * Custom hook for form handling
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSubmit - Function to call on form submission
 * @param {Function} validate - Optional validation function
 * @returns {Object} - Form state and handlers
 */
const useForm = (initialValues = {}, onSubmit = () => {}, validate = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form to initial values
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set form values
  const setFormValues = useCallback((newValues) => {
    setValues(newValues);
  }, []);

  // Handle input change
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    setValues((prevValues) => ({
      ...prevValues,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }, []);

  // Handle input blur (for validation)
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    setTouched((prevTouched) => ({
      ...prevTouched,
      [name]: true,
    }));
    
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  }, [validate, values]);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      
      setIsSubmitting(true);
      
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {}
      );
      setTouched(allTouched);
      
      // Validate form
      let validationErrors = {};
      if (validate) {
        validationErrors = validate(values);
        setErrors(validationErrors);
      }
      
      // If no errors, submit form
      if (Object.keys(validationErrors).length === 0) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
        }
      }
      
      setIsSubmitting(false);
    },
    [onSubmit, validate, values]
  );

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormValues,
    setErrors,
  };
};

export default useForm;