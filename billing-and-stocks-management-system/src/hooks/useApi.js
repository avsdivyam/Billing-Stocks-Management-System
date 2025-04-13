import { useState, useCallback } from 'react';
import { useToast } from '../context/ToastContext';

/**
 * Custom hook for handling API calls with loading, error, and success states
 * @param {Function} apiFunction - The API function to call
 * @param {Object} options - Options for the hook
 * @returns {Object} - The hook's state and functions
 */
const useApi = (apiFunction, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const toast = useToast();

  const {
    showSuccessToast = true,
    showErrorToast = true,
    successMessage = 'Operation completed successfully',
    errorMessage = 'An error occurred',
    onSuccess = null,
    onError = null,
  } = options;

  const execute = useCallback(
    async (...args) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiFunction(...args);
        setData(result);

        if (showSuccessToast) {
          toast.showSuccess(
            result?.message || successMessage
          );
        }

        if (onSuccess) {
          onSuccess(result);
        }

        return result;
      } catch (err) {
        setError(err);

        if (showErrorToast) {
          toast.showError(
            err?.error || errorMessage
          );
        }

        if (onError) {
          onError(err);
        }

        throw err;
      } finally {
        setLoading(false);
      }
    },
    [
      apiFunction,
      showSuccessToast,
      showErrorToast,
      successMessage,
      errorMessage,
      onSuccess,
      onError,
      toast,
    ]
  );

  return {
    data,
    loading,
    error,
    execute,
    setData,
  };
};

export default useApi;