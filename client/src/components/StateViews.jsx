import React from 'react';
import { AlertTriangle, RefreshCw, Inbox, SearchX } from 'lucide-react';

/**
 * 1. Loading State View
 */
export const LoadingView = () => {
  return (
    <div className="loading-view-container" role="status" aria-live="polite">
      <div className="spinner-wrapper">
        <div className="spinner-ring" />
        <div className="spinner-ring" />
      </div>
      <p className="loading-text">Fetching campus notices...</p>

      {/* Modern skeleton placeholders */}
      <div className="skeleton-grid" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="skeleton-shimmer skeleton-badge" />
              <div className="skeleton-shimmer" style={{ width: 60, height: 16 }} />
            </div>
            <div className="skeleton-shimmer skeleton-title" />
            <div className="skeleton-shimmer skeleton-box" />
            <div className="skeleton-shimmer skeleton-actions" />
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * 2. Error State View
 */
export const ErrorView = ({ error, onRetry }) => {
  return (
    <section className="error-view-container" role="alert">
      <div className="error-icon-box">
        <AlertTriangle size={28} />
      </div>
      <h3 className="error-title">Unable to Load Notices</h3>
      <p className="error-message">
        {error || 'An unexpected error occurred while communicating with the server. Please check your network connection and backend server.'}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="btn-retry"
        id="retry-fetch-btn"
      >
        <RefreshCw size={16} />
        <span>Retry Connection</span>
      </button>
    </section>
  );
};

/**
 * 3. Empty State View
 */
export const EmptyView = ({ category = 'All', hasSearch = false, onClearSearch }) => {
  let title = 'No Notices Found';
  let description =
    'There are currently no lost or found notices posted on the campus board. Be the first to report!';

  if (hasSearch) {
    title = 'No Matching Notices';
    description = 'No lost or found items matched your search query. Try searching with different keywords.';
  } else if (category === 'Lost') {
    title = 'No Lost Items Reported';
    description = 'Good news! There are currently no unresolved lost item reports on campus.';
  } else if (category === 'Found') {
    title = 'No Found Items Waiting';
    description = 'No found items are currently waiting to be claimed. Found something? Report it now!';
  }

  return (
    <div className="empty-view-container">
      <div className="empty-icon-box">
        {hasSearch ? <SearchX size={32} /> : <Inbox size={32} />}
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{description}</p>
      {hasSearch && (
        <button
          type="button"
          onClick={onClearSearch}
          className="btn-toggle-resolve"
          style={{ marginTop: '0.5rem' }}
        >
          Clear search filter
        </button>
      )}
    </div>
  );
};
