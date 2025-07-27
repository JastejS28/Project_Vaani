import React, { useEffect, useState } from 'react';
import './FormModal.css';

const FormModal = ({ formFilename, onClose }) => {
  const [formContent, setFormContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/form/${formFilename}`);
        if (!response.ok) {
          throw new Error('Failed to load form');
        }
        const html = await response.text();
        setFormContent(html);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (formFilename) {
      fetchForm();
    }
  }, [formFilename]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="form-modal-overlay" onClick={handleOverlayClick}>
      <div className="form-modal-content">
        <div className="form-modal-header">
          <h2>Application Form</h2>
          <button className="form-close-btn" onClick={onClose}>×</button>
        </div>
        <div className="form-modal-body">
          {loading && <div className="form-loading">Loading form...</div>}
          {error && <div className="form-error">Error: {error}</div>}
          {!loading && !error && (
            <iframe
              srcDoc={formContent}
              title="Application Form"
              className="form-iframe"
              sandbox="allow-forms allow-scripts"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FormModal;