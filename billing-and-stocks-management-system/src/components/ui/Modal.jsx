import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FiX } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import Button from './Button';

/**
 * Modal component for displaying content in a dialog
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when the modal is closed
 * @param {string} [props.title] - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} [props.footer] - Modal footer content
 * @param {string} [props.size='md'] - Modal size (sm, md, lg, xl, full)
 * @param {boolean} [props.closeOnOverlayClick=true] - Whether to close the modal when the overlay is clicked
 * @param {boolean} [props.showCloseButton=true] - Whether to show the close button
 * @param {string} [props.className] - Additional CSS classes
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = '',
  ...rest
}) => {
  // Ref for the modal content
  const modalRef = useRef(null);
  
  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };
  
  // Handle click outside
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };
  
  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (isOpen && e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 500 } },
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto"
          initial="hidden"
          animate="visible"
          exit="hidden"
          {...rest}
        >
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            variants={overlayVariants}
            onClick={handleOverlayClick}
          />
          
          {/* Modal container */}
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <motion.div
              ref={modalRef}
              className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 ${sizeClasses[size]} w-full ${className}`}
              variants={modalVariants}
            >
              {/* Modal header */}
              {(title || showCloseButton) && (
                <div className="bg-white px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    {title && <h3 className="text-lg font-semibold text-gray-800">{title}</h3>}
                    {showCloseButton && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                        aria-label="Close"
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FiX size={20} />
                      </Button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Modal body */}
              <div className="bg-white px-6 py-4">
                {children}
              </div>
              
              {/* Modal footer */}
              {footer && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  closeOnOverlayClick: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  className: PropTypes.string,
};

export default Modal;