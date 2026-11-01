import React from 'react';
import Icons from '../Icons';
import Badge from '../common/Badge';
import ShinyText from '../reactbits/ShinyText';
import type { Analysis, FormDataCase } from '../../types';

interface ReportPreviewViewProps {
  form: FormDataCase;
  analysis: Analysis | null;
  busy: boolean;
  onDownload: (kind: 'xlsx' | 'pdf' | 'docx') => void;
  onDownloadCsv: () => void;
  onNavigateToBuilder: () => void;
}

export const ReportPreviewView: React.FC<ReportPreviewViewProps> = ({
  form,
  analysis,
  busy,
  onDownload,
  onDownloadCsv,
  onNavigateToBuilder,
}) => {
  if (!analysis) {
    return (
      <div className="report-empty-state">
        <Icons.Report size={48} className="empty-icon" />
        <h2>No Active Analysis to Preview</h2>
        <p>Complete the business case inputs and run the calculation engine to generate an audit-ready executive memo.</p>
        <button
          type="button"
          className="primary-btn"
          onClick={onNavigateToBuilder}
        >
          Go to Business Case Builder
        </button>
      </div>
    );
  }

  const base = analysis.calculation.scenarios[1];
  const currency = form.currency.toUpperCase();

  const formatAmount = (val: number | null | undefined): string => {
    if (val == null) return 'UNKNOWN';
    return `${currency} ${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="report-preview-container">
      {/* Top Bar with Export Guidance and Actions */}
      <div className="report-header-card">
        <div className="report-header-left">
          <div className="eyebrow">
            <span className="dot" />
            <ShinyText text="BOARD MEMO & AUDIT DOCUMENTATION" speed={4} />
          </div>
          <h1 className="report-title">
            Executive Briefing <em>Preview</em>
          </h1>
          <p className="intro report-intro">
            A structured decision memo with transparent line-item math, three-scenario variance, and linked vendor evidence.
          </p>
        </div>

        {/* Export Action Buttons */}
        <div className="report-export-menu">
          <button
            type="button"
            className="export-menu-btn"
            disabled={busy}
            onClick={() => onDownload('xlsx')}
            title="Download Excel spreadsheet with live calculation formulas"
          >
            <Icons.Download size={15} />
            <div className="btn-text-block">
              <strong>Spreadsheet</strong>
              <small>.XLSX (Formulas)</small>
            </div>
          </button>

          <button
            type="button"
            className="export-menu-btn"
            disabled={busy}
            onClick={() => onDownload('pdf')}
            title="Download formatted executive memo PDF"
          >
            <Icons.Download size={15} />
            <div className="btn-text-block">
              <strong>PDF</strong>
              <small>Executive Memo</small>
            </div>
          </button>

          <button
            type="button"
            className="export-menu-btn"
            disabled={busy}
            onClick={() => onDownload('docx')}
            title="Download editable Word briefing document"
          >
            <Icons.Download size={15} />
            <div className="btn-text-block">
              <strong>Word</strong>
              <small>.DOCX Briefing</small>
            </div>
          </button>

          <button
            type="button"
            className="export-menu-btn"
            onClick={onDownloadCsv}
            title="Download comma-separated values file"
          >
            <Icons.Download size={15} />
            <div className="btn-text-block">
              <strong>Download CSV</strong>
              <small>Raw Data</small>
            </div>
          </button>

          <button
            type="button"
            className="export-menu-btn print-btn"
            onClick={() => window.print()}
          >
            <Icons.Print size={15} />
            <div className="btn-text-block">
              <strong>Print ↗</strong>
              <small>Browser print</small>
            </div>
          </button>
        </div>
      </div>

      {/* Styled Printable Document Sheet */}
      <article className="document-sheet">
        {/* Memo Header */}
        <header className="memo-header">
          <div className="memo-brand">
            <span className="memo-logo">PROOFDESK</span>
            <span className="memo-classification">EXECUTIVE DUE DILIGENCE MEMORANDUM</span>
          </div>

          <h2 className="memo-title">{form.name || 'Platform Modernization Business Case'}</h2>

          <div className="memo-meta-table">
            <div className="memo-meta-row">
              <span className="meta-th">PREPARED FOR:</span>
              <span className="meta-td">{form.role}</span>
              <span className="meta-th">TARGET PLATFORM:</span>
              <span className="meta-td">IOMETE Lakehouse</span>
            </div>
            <div className="memo-meta-row">
              <span className="meta-th">CURRENT SYSTEM:</span>
              <span className="meta-td">{form.platform || 'Not specified'}</span>
              <span className="meta-th">HORIZON &amp; FX:</span>
              <span className="meta-td">{form.horizon} Years · {form.fx} {currency}/USD</span>
            </div>
            <div className="memo-meta-row">
              <span className="meta-th">INDUSTRY:</span>
              <span className="meta-td">{form.industry || 'General enterprise'}</span>
              <span className="meta-th">HOSTING:</span>
              <span className="meta-td">{form.hosting || 'Customer Cloud / VPC'}</span>
            </div>
          </div>
        </header>

        {/* Section 1: Executive Summary */}
        <section className="memo-section">
          <h3 className="memo-section-heading">1. Executive Summary</h3>
          <p className="memo-paragraph">
            This memorandum evaluates the operational and financial implications of transitioning analytical workloads from {form.platform || 'the current data warehouse'} to an IOMETE lakehouse deployment. All financial figures are calculated in {currency} over a {form.horizon}-year planning horizon.
          </p>

          {base && (
            <div className="memo-summary-kpis">
              <div className="memo-kpi-box">
                <span className="kpi-label">Annualized Net Change</span>
                <strong className="kpi-num">{formatAmount(base.annual_change)}</strong>
                <small className="kpi-sub">
                  {base.annual_change && base.annual_change >= 0 ? 'Estimated annual run-rate savings' : 'Estimated cost increase'}
                </small>
              </div>

              <div className="memo-kpi-box">
                <span className="kpi-label">Proposed {form.horizon}-Year TCO</span>
                <strong className="kpi-num">{formatAmount(base.tco)}</strong>
                <small className="kpi-sub">Baseline: {formatAmount(base.baseline_tco)}</small>
              </div>

              <div className="memo-kpi-box">
                <span className="kpi-label">Simple Payback Period</span>
                <strong className="kpi-num">
                  {base.payback == null ? 'Unknown' : `${base.payback} years`}
                </strong>
                <small className="kpi-sub">One-time migration: {formatAmount(base.one_time)}</small>
              </div>
            </div>
          )}
        </section>

        {/* Section 2: Business Context & Technical Fit */}
        <section className="memo-section">
          <h3 className="memo-section-heading">2. Business Context &amp; Readiness</h3>
          <p className="memo-paragraph">
            <strong>Stated Objective:</strong> {form.objective || 'Evaluate platform migration for cost predictability and architecture sovereignty.'}
          </p>
          <p className="memo-paragraph">
            <strong>Technical Fit Assessment:</strong> {analysis.fit}. Kubernetes team expertise is listed as <em>"{form.skills}"</em>.
          </p>
          {form.migration_plan && (
            <p className="memo-paragraph">
              <strong>Migration Plan:</strong> {form.migration_plan}
            </p>
          )}
        </section>

        {/* Section 3: Three Scenario Analysis */}
        <section className="memo-section">
          <h3 className="memo-section-heading">3. Three-Scenario Sizing &amp; Variance</h3>
          <table className="memo-table">
            <thead>
              <tr>
                <th>Scenario</th>
                <th>Plan</th>
                <th className="cell-num">License / yr</th>
                <th className="cell-num">Recurring / yr</th>
                <th className="cell-num">Annualized</th>
                <th className="cell-num">Annual Change</th>
                <th className="cell-num">Proposed TCO</th>
              </tr>
            </thead>
            <tbody>
              {analysis.calculation.scenarios.map((s) => (
                <tr key={s.name}>
                  <td>{s.name} ({s.vcpu ?? 'unknown'} vCPU)</td>
                  <td>{s.plan}</td>
                  <td className="cell-num">{formatAmount(s.license)}</td>
                  <td className="cell-num">{formatAmount(s.recurring)}</td>
                  <td className="cell-num">{formatAmount(s.annualized)}</td>
                  <td className="cell-num">{formatAmount(s.annual_change)}</td>
                  <td className="cell-num font-bold">{formatAmount(s.tco)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Section 4: Sensitivity Analysis */}
        <section className="memo-section">
          <h3 className="memo-section-heading">4. Sensitivity &amp; Sign-Flip Thresholds</h3>
          <p className="memo-paragraph">
            Operating parameters were varied by ±{form.sensitivity}% to stress-test financial robustness. A sign flip indicates whether positive run-rate savings become a cost increase under variance.
          </p>
          <table className="memo-table">
            <thead>
              <tr>
                <th>Assumption Driver</th>
                <th className="cell-num">Lower ({form.sensitivity}%)</th>
                <th className="cell-num">Higher (+{form.sensitivity}%)</th>
                <th>Changes Sign?</th>
              </tr>
            </thead>
            <tbody>
              {analysis.calculation.sensitivity.length ? (
                analysis.calculation.sensitivity.map((s) => (
                  <tr key={s.input}>
                    <td>{s.input.replaceAll('_', ' ')}</td>
                    <td className="cell-num">{formatAmount(s.low)}</td>
                    <td className="cell-num">{formatAmount(s.high)}</td>
                    <td>{s.flips ? 'Yes (Sign Flips)' : 'No (Stable)'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>Sensitivity unavailable until all core parameters are supplied.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Section 5: Key Assumptions & Unknowns */}
        <section className="memo-section">
          <h3 className="memo-section-heading">5. Due Diligence Questions &amp; Audit Trail</h3>
          <ul className="memo-bullet-list">
            {analysis.unknowns.map((q) => (
              <li key={q}>
                <strong>[DUE DILIGENCE ITEM]</strong> {q}
              </li>
            ))}
          </ul>
        </section>

        {/* Section 6: Governance & Verification */}
        <section className="memo-section">
          <h3 className="memo-section-heading">6. Sourced Evidence &amp; Verification Limits</h3>
          <p className="memo-disclaimer">
            ProofDesk verifier enforces exact canonical text match and structured numerical checks. Writer: {analysis.report.writer}. All vendor pricing and licensing claims are vendor-stated and subject to contract validation.
          </p>
        </section>
      </article>
    </div>
  );
};

export default ReportPreviewView;
