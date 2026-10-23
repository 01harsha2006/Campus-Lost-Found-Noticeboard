import React from 'react';
import { Compass, Sun, Moon } from 'lucide-react';

export const Navbar = ({ theme = 'sand', onToggleTheme }) => {
  const isChocolate = theme === 'chocolate';

  return (
    <header className="site-header">
      <div className="header-content">
        <div className="brand">
          <div className="brand-icon-wrapper">
            <Compass size={24} />
          </div>
          <div>
            <h1 className="brand-title">Campus Lost &amp; Found</h1>
            <p className="brand-subtitle">Official Student &amp; Staff Board</p>
          </div>
        </div>

        <div className="header-right-actions">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={onToggleTheme}
            title={isChocolate ? 'Switch to Sand View' : 'Switch to Chocolate View'}
            id="theme-toggle-btn"
          >
            {isChocolate ? (
              <>
                <Sun size={15} />
                <span>Sand Mode</span>
              </>
            ) : (
              <>
                <Moon size={15} />
                <span>Chocolate Mode</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
