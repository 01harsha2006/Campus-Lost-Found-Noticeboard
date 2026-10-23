import React, { useState } from 'react';
import { PlusCircle, Tag, MapPin, Mail, AlertTriangle, Loader2 } from 'lucide-react';

export const ItemForm = ({ onSubmitItem, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Lost',
    location: '',
    contactInfo: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!['Lost', 'Found'].includes(formData.category)) {
      newErrors.category = 'Select a valid category';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.contactInfo.trim()) {
      newErrors.contactInfo = 'Contact details are required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await onSubmitItem({
      title: formData.title.trim(),
      category: formData.category,
      location: formData.location.trim(),
      contactInfo: formData.contactInfo.trim(),
    });

    if (success) {
      setFormData({
        title: '',
        category: 'Lost',
        location: '',
        contactInfo: '',
      });
      setErrors({});
    }
  };

  return (
    <aside className="form-panel" aria-labelledby="form-heading">
      <div className="form-header">
        <h2 id="form-heading" className="form-title">
          <PlusCircle size={20} color="var(--primary)" />
          Post a Notice
        </h2>
        <p className="form-desc">
          Lost something or found an item on campus? Report it below to notify the campus community.
        </p>
      </div>

      <form className="report-form" onSubmit={handleSubmit} noValidate>
        {/* Category Choice */}
        <div className="form-group">
          <label className="form-label" htmlFor="item-category">
            <Tag size={14} />
            Category <span className="required-star">*</span>
          </label>
          <div className="category-toggle-group" role="radiogroup" aria-label="Item Category">
            <button
              type="button"
              role="radio"
              aria-checked={formData.category === 'Lost'}
              className={`category-radio-btn ${formData.category === 'Lost' ? 'active-lost' : ''}`}
              onClick={() => setFormData((prev) => ({ ...prev, category: 'Lost' }))}
            >
              Lost Item
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={formData.category === 'Found'}
              className={`category-radio-btn ${formData.category === 'Found' ? 'active-found' : ''}`}
              onClick={() => setFormData((prev) => ({ ...prev, category: 'Found' }))}
            >
              Found Item
            </button>
          </div>
          {/* Also render semantic select for form autofill/accessibility */}
          <select
            id="item-category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-select"
            style={{ display: 'none' }}
          >
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
        </div>

        {/* Item Title */}
        <div className="form-group">
          <label className="form-label" htmlFor="item-title">
            Item Title <span className="required-star">*</span>
          </label>
          <input
            id="item-title"
            name="title"
            type="text"
            className="form-input"
            placeholder="e.g. Silver MacBook Air M2 in Black Sleeve"
            value={formData.title}
            onChange={handleChange}
            disabled={isSubmitting}
            maxLength={120}
          />
          {errors.title && (
            <div className="form-error-feedback" role="alert">
              <AlertTriangle size={13} />
              <span>{errors.title}</span>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="form-group">
          <label className="form-label" htmlFor="item-location">
            <MapPin size={14} />
            Location <span className="required-star">*</span>
          </label>
          <input
            id="item-location"
            name="location"
            type="text"
            className="form-input"
            placeholder="e.g. Central Library 2nd Floor or Science Quad"
            value={formData.location}
            onChange={handleChange}
            disabled={isSubmitting}
            maxLength={100}
          />
          {errors.location && (
            <div className="form-error-feedback" role="alert">
              <AlertTriangle size={13} />
              <span>{errors.location}</span>
            </div>
          )}
        </div>

        {/* Contact Info */}
        <div className="form-group">
          <label className="form-label" htmlFor="item-contact">
            <Mail size={14} />
            Contact Info <span className="required-star">*</span>
          </label>
          <input
            id="item-contact"
            name="contactInfo"
            type="text"
            className="form-input"
            placeholder="e.g. student@campus.edu or (555) 234-5678"
            value={formData.contactInfo}
            onChange={handleChange}
            disabled={isSubmitting}
            maxLength={100}
          />
          {errors.contactInfo && (
            <div className="form-error-feedback" role="alert">
              <AlertTriangle size={13} />
              <span>{errors.contactInfo}</span>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-submit"
          disabled={isSubmitting}
          id="submit-item-btn"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="spinner-ring" style={{ animation: 'spin 1s linear infinite' }} />
              <span>Publishing...</span>
            </>
          ) : (
            <>
              <PlusCircle size={16} />
              <span>Publish Notice</span>
            </>
          )}
        </button>
      </form>
    </aside>
  );
};

export default ItemForm;
