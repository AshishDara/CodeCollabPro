// src/components/Modal.jsx
import React from 'react';

// A reusable Modal component
const Modal = ({ isOpen, onClose, children }) => {
    // If the modal isn't open, render nothing
    if (!isOpen) {
        return null;
    }

    return (
        // The modal overlay that covers the page
        <div className="modal-overlay" onClick={onClose}>
            {/* The modal content box */}
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* The close button */}
                <button className="modal-close-btn" onClick={onClose}>
                    &times;
                </button>
                {/* The content of the modal is passed in as children */}
                {children}
            </div>
        </div>
    );
};

export default Modal;