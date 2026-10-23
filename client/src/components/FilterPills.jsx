import React from 'react';
import { Search, Filter } from 'lucide-react';

export const FilterPills = ({
  currentFilter,
  onFilterChange,
  counts = { all: 0, lost: 0, found: 0 },
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="filter-bar" role="toolbar" aria-label="Notices Filter and Search">
      <div className="filter-pills-group" role="tablist" aria-label="Filter notices by category">
        <button
          type="button"
          role="tab"
          id="filter-all-btn"
          aria-selected={currentFilter === 'All'}
          className={`filter-pill ${currentFilter === 'All' ? 'active' : ''}`}
          onClick={() => onFilterChange('All')}
        >
          <Filter size={14} />
          <span>All Notices</span>
          <span className="pill-count">{counts.all}</span>
        </button>

        <button
          type="button"
          role="tab"
          id="filter-lost-btn"
          aria-selected={currentFilter === 'Lost'}
          className={`filter-pill pill-lost ${currentFilter === 'Lost' ? 'active' : ''}`}
          onClick={() => onFilterChange('Lost')}
        >
          <span>Lost</span>
          <span className="pill-count">{counts.lost}</span>
        </button>

        <button
          type="button"
          role="tab"
          id="filter-found-btn"
          aria-selected={currentFilter === 'Found'}
          className={`filter-pill pill-found ${currentFilter === 'Found' ? 'active' : ''}`}
          onClick={() => onFilterChange('Found')}
        >
          <span>Found</span>
          <span className="pill-count">{counts.found}</span>
        </button>
      </div>

      <div className="feed-search-wrapper">
        <Search size={15} className="search-icon-inside" />
        <input
          type="search"
          className="search-input"
          placeholder="Filter by keyword or location..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search notice items"
          id="feed-search-input"
        />
      </div>
    </div>
  );
};

export default FilterPills;
