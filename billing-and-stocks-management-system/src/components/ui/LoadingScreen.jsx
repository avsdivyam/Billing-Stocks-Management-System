import React from 'react';
import PropTypes from 'prop-types';

/**
 * LoadingScreen component to display a loading spinner with optional message
 * 
 * @param {Object} props Component props
 * @param {string} [props.message='Loading...'] Message to display
 * @param {string} [props.size='medium'] Size of the loading spinner ('small', 'medium', 'large')
 * @param {boolean} [props.fullScreen=false] Whether to display as fullscreen overlay
 * @returns {React.ReactNode} Loading screen component
 */
const LoadingScreen = ({ message = 'Loading...', size = 'medium', fullScreen = false }) => {
  // Determine spinner size
  const spinnerSizes = {
    small: 'w-8 h-8 border-2',
    medium: 'w-12 h-12 border-3',
    large: 'w-16 h-16 border-4',
  };
  
  const spinnerSize = spinnerSizes[size] || spinnerSizes.medium;
  
  // Component for the spinner and message
  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`${spinnerSize} border-primary-500 border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="mt-4 text-gray-600 text-center">{message}</p>
      )}
    </div>
  );
  
  // If fullScreen, render as overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
        <LoadingContent />
      </div>
    );
  }
  
  // Otherwise render as normal component
  return (
    <div className="flex items-center justify-center py-12">
      <LoadingContent />
    </div>
  );
};

LoadingScreen.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullScreen: PropTypes.bool,
};

export default LoadingScreen;