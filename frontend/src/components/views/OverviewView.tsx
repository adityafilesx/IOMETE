import React from 'react';
import Icons from '../Icons';
import SpotlightCard from '../SpotlightCard';
import StarBorder from '../reactbits/StarBorder';
import ShinyText from '../reactbits/ShinyText';
import type { FormDataCase, SavedCase, Analysis } from '../../types';

interface OverviewViewProps {
  form: FormDataCase;
  savedCases: SavedCase[];
  analysis: Analysis | null;
  onNewCase: () => void;
  onOpenCase: (id: number) => void;
  onNavigate: (view: 'builder' | 'analysis' | 'evidence' | 'saved' | 'report') => void;
  onLoadExample: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  form,
  savedCases,
  analysis,
  onNewCase,
  onOpenCase,
  onNavigate,
  onLoadExample,
}) => {
  const hasCurrentDraft = Boolean(form.name.trim() || analysis);
  const baseScenario = analysis?.calculation.scenarios[1];
  const missingInputsCount = analysis?.calculation.missing.length ?? 0;
  const openQuestionsCount = analysis?.unknowns.length ?? 0;

  return (
    <div className="overview-container">
      {/* Welcome & Primary Hero */}
      <div className="overview-hero">
        <div className="overview-hero-text">
          <div className="eyebrow">
            <span className="dot" />
            <ShinyText text="TECHNICAL DUE-DILIGENCE & FINANCIAL INTELLIGENCE" speed={4} />
          </div>
          <h1 className="overview-title">
            Evidence-led business cases.
            <br />
            <em>Defensible platform decisions.</em>
          </h1>
          <p className="overview-subtitle">
            Assess technical fit, forecast realistic multi-year TCO, and verify vendor claims with transparent
            audit trails. Your calculations stay yours; no invented savings.
          </p>
          <div className="overview-cta-group">
            <StarBorder
              as="button"
              className="overview-primary-cta"
              onClick={() => onNavigate('builder')}
            >
              <Icons.Plus size={16} />
              <span>{hasCurrentDraft ? 'Continue Business Case' : 'Create New Business Case'}</span>
              <Icons.ArrowRight size={14} />
            </StarBorder>

            <button
              type="button"
              className="overview-secondary-cta"
              onClick={onLoadExample}
            >
              <Icons.Sparkles size={15} />
              <span>Load illustrative example ↗</span>
            </button>
          </div>
        </div>

        {/* Featured Spotlight Card */}
        <div className="overview-hero-card">
          <SpotlightCard
            className="overview-spotlight-card"
            spotlightColor="#10b981"
            intensity={0.12}
            ambient={false}
            flare={false}
            grain={0}
          >
            <div className="hero-card-header">
              <span className="hero-card-tag">METHODOLOGY</span>
              <span className="hero-card-badge">TRANSPARENT TCO</span>
            </div>
            <h3 className="hero-card-heading">
              Evidence before
              <br />
              recommendation.
            </h3>
            <p className="hero-card-description">
              Modeled across exact Decimal calculations. Missing buyer numbers are treated as unknowns rather than zeroed assumptions.
            </p>
            <div className="hero-card-points">
              <div className="hero-point">
                <span className="point-number">01</span>
                <div>
                  <strong>Transparent 3-Scenario Sizing</strong>
                  <p>Independent low, base, and high vCPU sizing with sign-flip sensitivity.</p>
                </div>
              </div>
              <div className="hero-point">
                <span className="point-number">02</span>
                <div>
                  <strong>Auditable Evidence Repository</strong>
                  <p>40+ dated public vendor claims linked directly to cost rules.</p>
                </div>
              </div>
              <div className="hero-point">
                <span className="point-number">03</span>
                <div>
                  <strong>Multi-Format Board Exports</strong>
                  <p>Audit-ready spreadsheets, executive PDFs, Word docs, and CSVs.</p>
                </div>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>

      {/* Workspace Summary Metrics */}
      <div className="overview-stats-grid">
        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">SAVED CASES</span>
            <span className="stat-icon"><Icons.Saved size={18} /></span>
          </div>
          <div className="stat-value">{savedCases.length}</div>
          <div className="stat-foot">
            {savedCases.length > 0 ? (
              <button
                type="button"
                className="stat-link-btn"
                onClick={() => onNavigate('saved')}
              >
                Manage saved cases <Icons.ArrowRight size={12} />
              </button>
            ) : (
              <span className="stat-note">Local SQLite repository ready</span>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">ACTIVE CASE STATE</span>
            <span className="stat-icon"><Icons.Builder size={18} /></span>
          </div>
          <div className="stat-value">
            {analysis ? (missingInputsCount > 0 ? 'Partial' : 'Complete') : 'Draft'}
          </div>
          <div className="stat-foot">
            <span className="stat-note">
              {form.name ? `Editing: ${form.name.slice(0, 24)}` : 'Ready to configure'}
            </span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">DUE DILIGENCE</span>
            <span className="stat-icon"><Icons.AlertTriangle size={18} /></span>
          </div>
          <div className="stat-value">
            {openQuestionsCount > 0 ? `${openQuestionsCount} Open` : '0 Questions'}
          </div>
          <div className="stat-foot">
            <button
              type="button"
              className="stat-link-btn"
              onClick={() => onNavigate(analysis ? 'analysis' : 'builder')}
            >
              {openQuestionsCount > 0 ? 'Review unresolved questions' : 'Explore architecture checks'} <Icons.ArrowRight size={12} />
            </button>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">EVIDENCE REPOSITORY</span>
            <span className="stat-icon"><Icons.Evidence size={18} /></span>
          </div>
          <div className="stat-value">42 Records</div>
          <div className="stat-foot">
            <button
              type="button"
              className="stat-link-btn"
              onClick={() => onNavigate('evidence')}
            >
              Search evidence pack <Icons.ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Cases & Next Actions */}
      <div className="overview-split-grid">
        {/* Recent Cases */}
        <div className="overview-section-box">
          <div className="section-box-header">
            <div>
              <h2 className="section-box-title">Recent Business Cases</h2>
              <p className="section-box-desc">Quickly re-open or review previously modeled scenarios.</p>
            </div>
            {savedCases.length > 0 && (
              <button
                type="button"
                className="secondary-btn-sm"
                onClick={() => onNavigate('saved')}
              >
                View all ({savedCases.length})
              </button>
            )}
          </div>

          <div className="recent-cases-list">
            {savedCases.length === 0 ? (
              <div className="empty-case-prompt">
                <Icons.FolderOpen size={32} className="empty-icon" />
                <p>No saved cases found on this computer yet.</p>
                <div className="empty-actions">
                  <button
                    type="button"
                    className="primary-btn-sm"
                    onClick={() => onNavigate('builder')}
                  >
                    Start a business case
                  </button>
                  <button
                    type="button"
                    className="text-btn"
                    onClick={onLoadExample}
                  >
                    Load illustrative example ↗
                  </button>
                </div>
              </div>
            ) : (
              savedCases.slice(0, 4).map((c) => (
                <div key={c.id} className="case-row-item">
                  <div className="case-row-left">
                    <div className="case-file-icon"><Icons.Report size={18} /></div>
                    <div>
                      <strong className="case-row-name">{c.name}</strong>
                      <div className="case-row-meta">
                        <span>Updated {c.updated}</span>
                        <span className="meta-separator">·</span>
                        <span className="case-pill">ID #{c.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="case-row-actions">
                    <button
                      type="button"
                      className="primary-btn-sm"
                      onClick={() => onOpenCase(c.id)}
                    >
                      Open Case
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recommended Next Actions */}
        <div className="overview-section-box">
          <div className="section-box-header">
            <div>
              <h2 className="section-box-title">Defensible Next Steps</h2>
              <p className="section-box-desc">Actionable tasks based on current case state.</p>
            </div>
          </div>

          <div className="action-checklist">
            <div className={`action-task-card ${form.name ? 'task-ready' : 'task-pending'}`}>
              <div className="task-step-number">01</div>
              <div className="task-details">
                <strong>Define Buyer Baseline & Sizing</strong>
                <p>Provide current annual cost, platform staff, and peak vCPU estimates.</p>
                <button
                  type="button"
                  className="task-action-link"
                  onClick={() => onNavigate('builder')}
                >
                  {form.name ? 'Edit buyer inputs' : 'Configure baseline now'} <Icons.ChevronRight size={13} />
                </button>
              </div>
            </div>

            <div className={`action-task-card ${analysis ? 'task-ready' : 'task-pending'}`}>
              <div className="task-step-number">02</div>
              <div className="task-details">
                <strong>Analyze Financial Trajectory</strong>
                <p>Review annualized run-rate change, simple payback, and sensitivity flips.</p>
                <button
                  type="button"
                  className="task-action-link"
                  onClick={() => onNavigate(analysis ? 'analysis' : 'builder')}
                >
                  {analysis ? 'Inspect financial results' : 'Run analysis engine'} <Icons.ChevronRight size={13} />
                </button>
              </div>
            </div>

            <div className="action-task-card task-pending">
              <div className="task-step-number">03</div>
              <div className="task-details">
                <strong>Audit Evidence & Assumptions</strong>
                <p>Trace every memo statement back to dated public IOMETE documentation.</p>
                <button
                  type="button"
                  className="task-action-link"
                  onClick={() => onNavigate('evidence')}
                >
                  Search claim evidence <Icons.ChevronRight size={13} />
                </button>
              </div>
            </div>

            <div className="action-task-card task-pending">
              <div className="task-step-number">04</div>
              <div className="task-details">
                <strong>Export Briefing Package</strong>
                <p>Generate auditable XLSX formulas, PDF executive memo, or Word briefing.</p>
                <button
                  type="button"
                  className="task-action-link"
                  onClick={() => onNavigate(analysis ? 'report' : 'builder')}
                >
                  Review export options <Icons.ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewView;
