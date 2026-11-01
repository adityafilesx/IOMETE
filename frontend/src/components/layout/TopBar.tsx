import React from 'react';
import Icons from '../Icons';
import ShinyText from '../reactbits/ShinyText';

interface TopBarProps {
  caseName?: string;
  isSaved?: boolean;
  onNewCase?: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  caseName,
  isSaved,
  onNewCase,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          type="button"
          className="mobile-nav-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
        >
          {mobileMenuOpen ? <Icons.Close size={20} /> : <Icons.Layers size={20} />}
        </button>

        <a className="brand" href="/" aria-label="ProofDesk home">
          <span className="brandmark">
            P<span className="brand-star">✳</span>
          </span>
          <span className="brand-text">
            proofdesk<span className="branddot">.</span>
          </span>
        </a>

        {caseName ? (
          <div className="case-context-pill">
            <span className="case-label">CASE:</span>
            <span className="case-title" title={caseName}>
              {caseName}
            </span>
            {isSaved !== undefined && (
              <span className={`case-state-badge ${isSaved ? 'state-saved' : 'state-draft'}`}>
                {isSaved ? 'Saved ✓' : 'Draft'}
              </span>
            )}
          </div>
        ) : (
          <div className="topbar-tagline">
            <ShinyText text="A CLEARER CASE FOR CHANGE" speed={5} />
          </div>
        )}
      </div>

      <div className="topbar-right">
        {onNewCase && (
          <button
            type="button"
            className="topbar-action-btn"
            onClick={onNewCase}
            title="Create a fresh business case"
          >
            <Icons.Plus size={14} />
            <span>New Case</span>
          </button>
        )}
        <div className="local-env-badge" title="Running in single-user local prototype mode">
          <span className="status-dot-pulse" />
          <span>Local workspace</span>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
