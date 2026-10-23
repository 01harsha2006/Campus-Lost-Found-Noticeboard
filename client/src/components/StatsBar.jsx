import React from 'react';
import { Layers, AlertCircle, CheckCircle2, Award } from 'lucide-react';

export const StatsBar = ({ items = [] }) => {
  const total = items.length;
  const lostCount = items.filter((item) => item.category === 'Lost').length;
  const foundCount = items.filter((item) => item.category === 'Found').length;
  const resolvedCount = items.filter((item) => item.isResolved).length;

  return (
    <section className="stats-bar" aria-label="Noticeboard statistics">
      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
          <Layers size={20} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total Notices</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'var(--lost-bg)', color: 'var(--lost-color)' }}>
          <AlertCircle size={20} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{lostCount}</div>
          <div className="stat-label">Lost Reports</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'var(--found-bg)', color: 'var(--found-color)' }}>
          <CheckCircle2 size={20} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{foundCount}</div>
          <div className="stat-label">Found Reports</div>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon" style={{ background: 'var(--resolved-bg)', color: 'var(--resolved-color)' }}>
          <Award size={20} />
        </div>
        <div className="stat-info">
          <div className="stat-value">{resolvedCount}</div>
          <div className="stat-label">Resolved Items</div>
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
