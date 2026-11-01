import React from 'react';
import Icons from '../Icons';

export type NavView = 'overview' | 'builder' | 'analysis' | 'evidence' | 'saved' | 'report';

interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  hasAnalysis: boolean;
  savedCasesCount?: number;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  hasAnalysis,
  savedCasesCount,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const navItems: { id: NavView; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Icons.Overview size={17} />,
    },
    {
      id: 'builder',
      label: 'Business case',
      icon: <Icons.Builder size={17} />,
    },
    {
      id: 'analysis',
      label: 'Analysis & Scenarios',
      icon: <Icons.Analysis size={17} />,
      badge: hasAnalysis ? 'Active' : undefined,
    },
    {
      id: 'saved',
      label: 'Saved cases',
      icon: <Icons.Saved size={17} />,
      badge: savedCasesCount !== undefined ? savedCasesCount : undefined,
    },
    {
      id: 'evidence',
      label: 'Evidence library',
      icon: <Icons.Evidence size={17} />,
    },
    {
      id: 'report',
      label: 'Report & Exports',
      icon: <Icons.Report size={17} />,
    },
  ];

  const handleSelect = (view: NavView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {mobileMenuOpen && (
        <div
          className="mobile-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          role="presentation"
        />
      )}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-section-title">WORKSPACE</div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-nav-btn ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handleSelect(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge !== undefined && (
                  <span className={`nav-badge ${item.badge === 'Active' ? 'badge-pulse' : ''}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer-card">
          <div className="footer-card-icon">✳</div>
          <strong className="footer-card-title">
            Built for the
            <br />
            second conversation.
          </strong>
          <p className="footer-card-desc">
            Turn complex platform and pricing variables into an evidence-backed decision your team can defend.
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
