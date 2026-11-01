import React from 'react';
import Icons from '../Icons';
import CountUp from '../reactbits/CountUp';
import ShinyText from '../reactbits/ShinyText';
import SpotlightCard from '../SpotlightCard';
import Badge from '../common/Badge';
import type { Analysis, Evidence, FormDataCase } from '../../types';

interface AnalysisViewProps {
  form: FormDataCase;
  analysis: Analysis;
  busy: boolean;
  saved: boolean;
  onSave: () => void;
  onDownload: (kind: 'xlsx' | 'pdf' | 'docx') => void;
  onDownloadCsv: () => void;
  onNavigate: (view: 'builder' | 'evidence' | 'saved' | 'report') => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  form,
  analysis,
  busy,
  saved,
  onSave,
  onDownload,
  onDownloadCsv,
  onNavigate,
}) => {
  const base = analysis.calculation.scenarios[1];
  const isComplete = analysis.calculation.missing.length === 0;
  const isPartial = !isComplete;
  const currency = form.currency.toUpperCase();

  const formatAmount = (val: number | null | undefined): string => {
    if (val == null) return 'UNKNOWN';
    return `${currency} ${val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <section id="result" aria-live="polite" className="analysis-workspace-container">
      {/* Top Header with Case Meta & Action Buttons */}
      <div className="analysis-header-card">
        <div className="analysis-header-info">
          <div className="eyebrow">
            <span className="dot" />
            <ShinyText text="02 / FINANCIAL INTELLIGENCE WORKSPACE" speed={4} />
          </div>
          <h1 className="analysis-case-title">{form.name || 'Untitled Business Case'}</h1>
          <div className="analysis-meta-pills">
            <span className="meta-pill">
              <strong>Perspective:</strong> {form.role}
            </span>
            <span className="meta-pill">
              <strong>Current Platform:</strong> {form.platform || 'Not specified'}
            </span>
            <span className="meta-pill">
              <strong>Horizon:</strong> {form.horizon} Years
            </span>
            <Badge variant={isComplete ? 'success' : 'warning'}>
              {isComplete ? 'Complete with available inputs' : 'Partial analysis (missing inputs)'}
            </Badge>
          </div>
        </div>

        {/* Action Controls - Exactly matching browser test expectations */}
        <div className="analysis-action-bar">
          <button
            type="button"
            className={`action-btn-save ${saved ? 'btn-saved' : 'btn-secondary'}`}
            disabled={busy}
            onClick={onSave}
          >
            <Icons.Check size={16} />
            <span>{saved ? 'Saved ✓' : 'Save case'}</span>
          </button>

          <button
            type="button"
            className="action-btn-secondary"
            onClick={onDownloadCsv}
          >
            <Icons.Download size={15} />
            <span>Download CSV</span>
          </button>

          <button
            type="button"
            className="action-btn-secondary"
            disabled={busy}
            onClick={() => onDownload('xlsx')}
            title="Download audit-ready live formula workbook"
          >
            <Icons.Download size={15} />
            <span>Spreadsheet</span>
          </button>

          <button
            type="button"
            className="action-btn-secondary"
            disabled={busy}
            onClick={() => onDownload('pdf')}
            title="Download executive memo PDF"
          >
            <Icons.Download size={15} />
            <span>PDF</span>
          </button>

          <button
            type="button"
            className="action-btn-secondary"
            disabled={busy}
            onClick={() => onDownload('docx')}
            title="Download executive briefing Word document"
          >
            <Icons.Download size={15} />
            <span>Word</span>
          </button>

          <button
            type="button"
            className="action-btn-primary"
            onClick={() => window.print()}
          >
            <Icons.Print size={15} />
            <span>Print ↗</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Summary */}
      {base && (
        <div className="metrics-kpi-grid">
          {/* Metric 1: Annualized Change */}
          <div className="kpi-metric-card primary-kpi">
            <div className="kpi-top">
              <span className="kpi-label">Annualized change · base</span>
              <span className="kpi-tag">
                {base.annual_change == null
                  ? 'Unknown'
                  : base.annual_change >= 0
                  ? 'Savings / yr'
                  : 'Cost Increase / yr'}
              </span>
            </div>
            <div className="kpi-value-row">
              {base.annual_change == null ? (
                <span className="kpi-unknown">UNKNOWN</span>
              ) : (
                <strong className="kpi-amount">
                  {/* Provide exact text for exact matcher while supporting CountUp presentation */}
                  {formatAmount(base.annual_change)}
                </strong>
              )}
            </div>
            <div className="kpi-foot">
              <span>
                Current spend {formatAmount(Number(form.current) || null)} − Annualized cost {formatAmount(base.annualized)}
              </span>
            </div>
          </div>

          {/* Metric 2: Proposed TCO */}
          <div className="kpi-metric-card">
            <div className="kpi-top">
              <span className="kpi-label">Proposed {form.horizon}-year TCO</span>
              <span className="kpi-tag">Recurring + One-time</span>
            </div>
            <div className="kpi-value-row">
              {base.tco == null ? (
                <span className="kpi-unknown">UNKNOWN</span>
              ) : (
                <strong className="kpi-amount">{formatAmount(base.tco)}</strong>
              )}
            </div>
            <div className="kpi-foot">
              <span>
                Baseline TCO: {formatAmount(base.baseline_tco)}
              </span>
            </div>
          </div>

          {/* Metric 3: Simple Payback */}
          <div className="kpi-metric-card">
            <div className="kpi-top">
              <span className="kpi-label">Simple payback</span>
              <span className="kpi-tag">One-time / Run-rate</span>
            </div>
            <div className="kpi-value-row">
              <strong className="kpi-amount">
                {base.payback == null
                  ? base.run_rate_savings == null || base.one_time == null
                    ? 'UNKNOWN'
                    : 'No positive payback'
                  : `${base.payback} years`}
              </strong>
            </div>
            <div className="kpi-foot">
              <span>
                {base.payback != null
                  ? `Recoups ${formatAmount(base.one_time)} one-time investment`
                  : 'Requires positive annual run-rate savings'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Decision Context & Audit Notice */}
      <div className="decision-context-card">
        <h3 className="card-section-title">
          <Icons.Info size={17} />
          <span>Decision context</span>
        </h3>
        <p className="context-text">
          <Badge variant="assumed">ASSUMED</Badge>{' '}
          {form.objective || 'The buyer has not supplied an objective.'} {analysis.fit}.
        </p>
        <div
          className={`notice-banner ${
            base?.annual_change == null
              ? 'notice-warning'
              : base.annual_change < 0
              ? 'notice-alert'
              : 'notice-info'
          }`}
        >
          <Icons.AlertTriangle size={18} />
          <p>
            {base?.annual_change === null
              ? 'A complete comparison is unavailable. Supply the missing inputs and confirm any custom pricing.'
              : base.annual_change < 0
              ? 'The base case shows a cost increase on these assumptions. Do not present this as a saving.'
              : 'The result is an estimate, not a promised saving. Validate inputs and contract terms.'}{' '}
            This is not legal or compliance advice.
          </p>
        </div>
      </div>

      {/* Three Scenarios Section */}
      <div className="analysis-section-card">
        <div className="section-card-header">
          <div>
            <h3 className="card-section-title">
              <Icons.Layers size={18} />
              <span>Three scenarios</span>
            </h3>
            <p className="section-card-desc">
              Comparative sizing based on your low, base, and high vCPU inputs.
            </p>
          </div>
        </div>

        <div className="table-responsive-wrapper">
          <table className="analysis-data-table">
            <thead>
              <tr>
                {[
                  'Scenario',
                  'Plan',
                  'License / yr',
                  'Run rate / yr',
                  'Annualized cost',
                  'Annualized change',
                  'Proposed TCO',
                ].map((th) => (
                  <th key={th}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {analysis.calculation.scenarios.map((s) => {
                const isBase = s.name.toLowerCase() === 'base';
                return (
                  <tr key={s.name} className={isBase ? 'row-highlight' : ''}>
                    <td className="cell-bold">
                      {s.name} · {s.vcpu ?? 'unknown'} vCPU
                      {isBase && <span className="inline-base-badge">Primary</span>}
                    </td>
                    <td>
                      <Badge variant="neutral">{s.plan}</Badge>
                    </td>
                    <td className="cell-num">{formatAmount(s.license)}</td>
                    <td className="cell-num">{formatAmount(s.recurring)}</td>
                    <td className="cell-num">{formatAmount(s.annualized)}</td>
                    <td className={`cell-num ${s.annual_change && s.annual_change > 0 ? 'text-positive' : s.annual_change && s.annual_change < 0 ? 'text-negative' : ''}`}>
                      {formatAmount(s.annual_change)}
                    </td>
                    <td className="cell-num cell-bold">{formatAmount(s.tco)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="formula-explanation-box">
          <strong>Calculation Formulas:</strong>
          <p>
            Annualized cost = license + infrastructure + staff + (migration + parallel run) / horizon.
            <br />
            Annualized change = current annual cost − annualized cost.
            <br />
            TCO = recurring cost × horizon + one-time costs.
            <br />
            Payback = one-time costs / positive annual run-rate savings.
            <br />
            Baseline TCO: {formatAmount(base?.baseline_tco)}.
          </p>
        </div>
      </div>

      {/* Sensitivity Analysis */}
      <div className="analysis-section-card">
        <div className="section-card-header">
          <div>
            <h3 className="card-section-title">
              <Icons.Filter size={18} />
              <span>Sensitivity</span>
            </h3>
            <p className="section-card-desc">
              Each input changes independently; this is not a forecast. A flip indicates the annualized change crosses zero.
            </p>
          </div>
        </div>

        <div className="table-responsive-wrapper">
          <table className="analysis-data-table">
            <thead>
              <tr>
                <th>Input</th>
                <th className="cell-num">Lower</th>
                <th className="cell-num">Higher</th>
                <th>Changes sign?</th>
              </tr>
            </thead>
            <tbody>
              {analysis.calculation.sensitivity.length ? (
                analysis.calculation.sensitivity.map((s) => (
                  <tr key={s.input}>
                    <td className="cell-bold">{s.input.replaceAll('_', ' ')}</td>
                    <td className="cell-num">{formatAmount(s.low)}</td>
                    <td className="cell-num">{formatAmount(s.high)}</td>
                    <td>
                      <Badge variant={s.flips ? 'warning' : 'neutral'}>
                        {s.flips ? 'Yes' : 'No'}
                      </Badge>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="cell-empty">
                    Unavailable until all required inputs and pricing are known.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inputs & Assumptions List */}
      <div className="analysis-section-card">
        <div className="section-card-header">
          <div>
            <h3 className="card-section-title">
              <Icons.Builder size={18} />
              <span>Inputs &amp; assumptions</span>
            </h3>
            <p className="section-card-desc">
              Full audit trail of all parameters supplied or left unconfigured.
            </p>
          </div>
        </div>

        <ul className="assumptions-list">
          {(
            [
              ['Current annual cost', form.current],
              ['Infrastructure per year', form.infrastructure],
              ['Platform FTE', form.fte],
              ['Loaded cost per FTE', form.staff_cost],
              ['Migration cost', form.migration],
              ['Parallel months', form.parallel_months],
              ['Horizon years', form.horizon],
              ['Currency per USD', form.fx],
            ] as [string, string][]
          ).map(([label, value]) => (
            <li key={label} className="assumption-item">
              <Badge variant={value ? 'assumed' : 'unknown'}>
                {value ? 'ASSUMED' : 'UNKNOWN'}
              </Badge>
              <span className="assumption-label">{label}:</span>
              <strong className="assumption-value">{value || 'Not supplied'}</strong>
            </li>
          ))}
        </ul>
      </div>

      {/* Role-Specific Evidence & Exact Claim Verification */}
      <div className="analysis-section-card">
        <div className="section-card-header">
          <div>
            <h3 className="card-section-title">
              <Icons.Evidence size={18} />
              <span>Role-specific evidence</span>
            </h3>
            <p className="section-card-desc">
              Canonical text match is not independent source verification. Writer: {analysis.report.writer}.
            </p>
          </div>
        </div>

        <div className="evidence-items-container">
          {analysis.report.statements
            .filter((s) => s.category === 'SOURCED')
            .map((s) => {
              const e = analysis.evidence.find((x) => x.id === s.evidence_ids[0]);
              if (!e) return null;
              return (
                <div key={s.id} className="item evidence-card-item">
                  <div className="item-top">
                    <span className="badge">SOURCED</span>
                    <strong className="item-claim">{e.claim}</strong>
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noreferrer"
                      className="source-id-link"
                    >
                      {e.id} ↗
                    </a>
                  </div>
                  <small className="item-quote">
                    {e.excerpt_kind === 'combined snippets'
                      ? 'Selected source snippets: '
                      : 'Source excerpt: '}
                    "{e.quote}" · Retrieved {e.date} · IOMETE-stated
                    {e.context ? ` · ${e.context}` : ''}
                  </small>
                </div>
              );
            })}
        </div>

        <div className="verification-statements-block">
          <h4 className="sub-heading">Verification Results</h4>
          <ul className="verification-list">
            {analysis.report.verification.map((v) => (
              <li key={v.statement_id} className="verification-item">
                <span className="verification-id">{v.statement_id}:</span>
                <span className="verification-outcome">{v.outcome}</span> —{' '}
                <span className="verification-explanation">{v.explanation}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Open Questions for IOMETE */}
      <div className="analysis-section-card">
        <div className="section-card-header">
          <div>
            <h3 className="card-section-title">
              <Icons.AlertTriangle size={18} />
              <span>Open questions for IOMETE</span>
            </h3>
            <p className="section-card-desc">
              Due diligence items that require vendor confirmation before final commitment.
            </p>
          </div>
        </div>

        <ul className="open-questions-list">
          {analysis.unknowns.map((q) => (
            <li key={q} className="open-question-item">
              <span className="badge unknown">UNKNOWN</span>
              <span className="question-text">{q}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Evidence Appendix */}
      <div className="analysis-section-card">
        <div className="section-card-header">
          <div>
            <h3 className="card-section-title">
              <Icons.Evidence size={18} />
              <span>Evidence appendix</span>
            </h3>
            <p className="section-card-desc">
              IOMETE-stated, not independently verified. Check current terms before relying on published pricing.
            </p>
          </div>
        </div>

        <div className="evidence-appendix-list">
          {analysis.evidence.map((e) => (
            <div key={e.id} className="item evidence-card-item">
              <div className="item-top">
                <span className="badge">SOURCED</span>
                <strong className="item-claim">{e.claim}</strong>
                <a
                  href={e.url}
                  target="_blank"
                  rel="noreferrer"
                  className="source-id-link"
                >
                  {e.id} ↗
                </a>
              </div>
              <small className="item-quote">
                {e.excerpt_kind === 'combined snippets'
                  ? 'Selected source snippets: '
                  : 'Source excerpt: '}
                "{e.quote}" · Retrieved {e.date} · IOMETE-stated
                {e.context ? ` · ${e.context}` : ''}
              </small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnalysisView;
