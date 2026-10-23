import React, { useState } from 'react';
import {
  MapPin,
  Mail,
  Clock,
  CheckCircle2,
  RotateCcw,
  Trash2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const ItemCard = ({ item, onToggleResolved, onDeleteItem }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isLost = item.category === 'Lost';
  const isResolved = item.isResolved;

  // Format created date
  const formatDate = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleToggle = async () => {
    setIsUpdating(true);
    await onToggleResolved(item._id);
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      // Auto-reset confirmation after 4 seconds
      setTimeout(() => setConfirmDelete(false), 4000);
      return;
    }
    setIsDeleting(true);
    await onDeleteItem(item._id);
    setIsDeleting(false);
  };

  return (
    <article
      className={`item-card ${isLost ? 'category-lost' : 'category-found'} ${
        isResolved ? 'resolved-card' : ''
      }`}
      id={`item-card-${item._id}`}
      aria-label={`${item.category} notice: ${item.title}`}
    >
      <div>
        {/* Top Badges & Date */}
        <div className="card-top-row">
          <div className="badges-group">
            <span
              className={`category-badge ${isLost ? 'badge-lost' : 'badge-found'}`}
            >
              {isLost ? <AlertCircle size={12} /> : <Sparkles size={12} />}
              {item.category}
            </span>

            <span
              className={`status-badge ${
                isResolved ? 'status-resolved' : 'status-active'
              }`}
            >
              {isResolved ? (
                <>
                  <CheckCircle2 size={12} />
                  Resolved
                </>
              ) : (
                <>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#818cf8',
                      display: 'inline-block',
                    }}
                  />
                  Active
                </>
              )}
            </span>
          </div>

          <time className="card-date" dateTime={item.createdAt}>
            <Clock size={12} />
            {formatDate(item.createdAt)}
          </time>
        </div>

        {/* Title */}
        <h3
          className={`card-title ${isResolved ? 'resolved-title' : ''}`}
          style={{ marginTop: '0.85rem' }}
        >
          {item.title}
        </h3>

        {/* Location & Contact Info */}
        <div className="card-details-list" style={{ marginTop: '1rem' }}>
          <div className="detail-row">
            <MapPin size={15} className="detail-icon" />
            <span className="detail-text">
              <strong>Location:</strong> {item.location}
            </span>
          </div>

          <div className="detail-row">
            <Mail size={15} className="detail-icon" />
            <span className="detail-text">
              <strong>Contact:</strong> {item.contactInfo}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card-actions-row">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isUpdating}
          className={`btn-toggle-resolve ${
            isResolved ? 'is-resolved-btn' : 'is-active-btn'
          }`}
          title={isResolved ? 'Mark this notice as Active again' : 'Mark as Reunited / Resolved'}
          id={`toggle-resolve-${item._id}`}
        >
          {isResolved ? (
            <>
              <RotateCcw size={14} />
              <span>Reopen Notice</span>
            </>
          ) : (
            <>
              <CheckCircle2 size={14} />
              <span>Mark Resolved</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="btn-delete"
          style={
            confirmDelete
              ? {
                  width: 'auto',
                  padding: '0 0.6rem',
                  color: 'var(--danger-color)',
                  borderColor: 'rgba(239, 68, 68, 0.4)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  gap: '0.35rem',
                }
              : {}
          }
          title={confirmDelete ? 'Click again to confirm deletion' : 'Delete this notice'}
          id={`delete-btn-${item._id}`}
        >
          <Trash2 size={15} />
          {confirmDelete && <span>Confirm?</span>}
        </button>
      </div>
    </article>
  );
};

export default ItemCard;
