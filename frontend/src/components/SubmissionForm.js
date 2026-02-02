import React, { useState } from 'react';
import '../assets/styles/form.css';

const SubmissionForm = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    submissionText: '',
    submissionLink: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.submissionText && !formData.submissionLink) {
      alert('Please provide either text or a link');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form className="submission-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="submissionText">Submission Text</label>
        <textarea
          id="submissionText"
          name="submissionText"
          value={formData.submissionText}
          onChange={handleChange}
          placeholder="Enter your submission text here..."
          rows="6"
        />
      </div>

      <div className="form-group">
        <label htmlFor="submissionLink">Submission Link</label>
        <input
          type="url"
          id="submissionLink"
          name="submissionLink"
          value={formData.submissionLink}
          onChange={handleChange}
          placeholder="https://example.com/submission"
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Task'}
      </button>
    </form>
  );
};

export default SubmissionForm;
