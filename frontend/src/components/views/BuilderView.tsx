import React, { useState } from 'react';
import Icons from '../Icons';
import Tooltip from '../common/Tooltip';
import SpotlightCard from '../SpotlightCard';
import StarBorder from '../reactbits/StarBorder';
import type { FormDataCase } from '../../types';

interface BuilderViewProps {
  form: FormDataCase;
  onChange: (key: keyof FormDataCase, value: string | string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onLoadExample: () => void;
  busy: boolean;
  error: string;
}

const CONTROLS: [string, string][] = [
  ['masking', 'Data masking'],
  ['security', 'Role-level security'],
  ['auditing', 'Auditing'],
  ['multi_region', 'Multi-region'],
  ['air_gapped', 'Air-gapped'],
];

export const BuilderView: React.FC<BuilderViewProps> = ({
  form,
  onChange,
  onSubmit,
  onLoadExample,
  busy,
  error,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'context' | 'baseline' | 'operations'>('all');

  const field = (
    key: keyof FormDataCase,
    label: string,
    unit = '',
    tooltip = '',
    opts: {
      type?: string;
      min?: number;
      max?: number;
      step?: string;
      required?: boolean;
      pattern?: string;
      placeholder?: string;
    } = {}
  ) => {
    const value = form[key] as string;
    return (
      <div className="form-field-group" key={key}>
        <div className="field-header">
          <label htmlFor={`input-${key}`} className="field-label">
            {label}
            {unit && <span className="field-unit">({unit})</span>}
          </label>
          <div className="field-header-right">
            {opts.required ? (
              <span className="field-tag required">Required</span>
            ) : (
              <span className="field-tag optional">Optional / Unknown</span>
            )}
            {tooltip && <Tooltip content={tooltip} />}
          </div>
        </div>

        <div className="input-wrapper">
          <input
            id={`input-${key}`}
            name={key}
            type={opts.type || 'text'}
            value={value}
            min={opts.min}
            max={opts.max}
            step={opts.step}
            required={opts.required}
            pattern={opts.pattern}
            placeholder={opts.placeholder}
            onChange={(e) => onChange(key, e.target.value)}
            className="text-input"
          />
        </div>
      </div>
    );
  };

  const numberField = (
    key: keyof FormDataCase,
    label: string,
    unit = '',
    tooltip = '',
    max?: number,
    placeholder = 'Leave blank if unknown'
  ) =>
    field(key, label, unit, tooltip, {
      type: 'number',
      min: 0,
      max,
      step: 'any',
      placeholder,
    });

  return (
    <div className="builder-container">
      {/* Page Title & Intro */}
      <div className="builder-header">
        <div>
          <div className="eyebrow">
            <span className="dot" />
            <span>01 / BUSINESS CASE BUILDER</span>
          </div>
          <h1 className="builder-title">
            Make the case.
            <br />
            <em>Show your work.</em>
          </h1>
          <p className="builder-intro">
            Construct an auditable, evidence-backed financial comparison. Unsupplied values remain explicitly
            labelled as unknowns rather than silently assumed as zero.
          </p>
        </div>

        <div className="builder-header-aside">
          <span className="aside-eyebrow">AUDITABLE MODEL</span>
          <strong>Evidence before recommendation.</strong>
          <p>Built for the people who have to defend the numbers in front of the board.</p>
        </div>
      </div>

      {/* Progress Steps Indicator */}
      <div className="workflow-steps" aria-label="Workflow progress">
        <div className="workflow-step active">
          <span className="step-num">01</span>
          <div className="step-info">
            <strong>Describe Situation</strong>
            <small>Buyer baseline & scale</small>
          </div>
        </div>
        <div className="workflow-step">
          <span className="step-num">02</span>
          <div className="step-info">
            <strong>Review The Numbers</strong>
            <small>Transparent analysis</small>
          </div>
        </div>
        <div className="workflow-step">
          <span className="step-num">03</span>
          <div className="step-info">
            <strong>Share The Case</strong>
            <small>Memo & exports</small>
          </div>
        </div>
      </div>

      {/* Main Form + Right Rail Layout */}
      <div className="builder-grid">
        <div className="form-column">
          <div className="form-panel-card">
            {/* Form Card Header */}
            <div className="form-panel-header">
              <div>
                <span className="section-pretitle">THE INPUTS</span>
                <h2 className="form-panel-title">Start with what you know.</h2>
                <p className="form-panel-desc">
                  Leave unknown figures empty; the analysis engine transparently surfaces missing data points.
                </p>
              </div>

              <button
                type="button"
                className="example-loader-btn"
                onClick={onLoadExample}
              >
                <Icons.Sparkles size={14} />
                <span>Load illustrative example</span>
              </button>
            </div>

            {/* Error Banner if any */}
            {error && (
              <div className="form-error-banner" role="alert">
                <Icons.AlertTriangle size={18} />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit} noValidate={false}>
              {/* Section 01: About the case */}
              <section className="form-section-block">
                <div className="section-block-indicator">
                  <span className="section-badge">01</span>
                </div>
                <div className="section-block-content">
                  <div className="section-title-wrap">
                    <h3 className="section-heading">About the case</h3>
                    <p className="section-caption">
                      Give this analysis a recognizable name and declare the decision-maker perspective.
                    </p>
                  </div>

                  <div className="fields-grid">
                    {field(
                      'name',
                      'Case name',
                      '',
                      'A clear label for internal tracking and export memos.',
                      { required: true, placeholder: 'e.g. Q4 Data Platform Evaluation' }
                    )}

                    <div className="form-field-group">
                      <div className="field-header">
                        <label htmlFor="input-role" className="field-label">
                          Your perspective
                        </label>
                        <Tooltip content="Adapts evidence prioritization and rule warnings to your functional stakeholder lens." />
                      </div>
                      <select
                        id="input-role"
                        value={form.role}
                        onChange={(e) => onChange('role', e.target.value)}
                        className="select-input"
                      >
                        {['CFO', 'Security lead', 'CTO / architect', 'Student / newcomer'].map((x) => (
                          <option key={x} value={x}>
                            {x}
                          </option>
                        ))}
                      </select>
                    </div>

                    {field(
                      'platform',
                      'Current platform',
                      '',
                      'Existing data warehouse or lakehouse (e.g. Snowflake, Databricks, BigQuery, Redshift, or Hadoop).',
                      { placeholder: 'e.g. Snowflake / Databricks' }
                    )}

                    {field(
                      'industry',
                      'Industry',
                      '',
                      'Helps calibrate regulatory and compliance requirements.',
                      { placeholder: 'e.g. Financial Services / Healthcare' }
                    )}

                    <div className="form-field-group">
                      <div className="field-header">
                        <label htmlFor="input-skills" className="field-label">
                          Kubernetes skills
                        </label>
                        <Tooltip content="IOMETE runs in your cloud/VPC on Kubernetes. Skill availability affects team readiness checks." />
                      </div>
                      <select
                        id="input-skills"
                        value={form.skills}
                        onChange={(e) => onChange('skills', e.target.value)}
                        className="select-input"
                      >
                        <option value="unknown">Unknown</option>
                        <option value="yes">Available on the team</option>
                        <option value="no">Not available today</option>
                      </select>
                    </div>

                    {field(
                      'hosting',
                      'Hosting environment',
                      '',
                      'Cloud provider or on-premise infrastructure for deployment.',
                      { placeholder: 'e.g. AWS EKS, Azure AKS, GCP GKE, On-prem' }
                    )}
                  </div>

                  <div className="field-full-width">
                    <label htmlFor="input-objective" className="field-label">
                      What needs to change? <span className="field-tag optional">Optional</span>
                    </label>
                    <textarea
                      id="input-objective"
                      rows={2}
                      value={form.objective}
                      onChange={(e) => onChange('objective', e.target.value)}
                      placeholder="e.g. Unpredictable compute bills, high vendor lock-in, compliance requirements for data residency..."
                      className="textarea-input"
                    />
                  </div>

                  <div className="field-full-width">
                    <label htmlFor="input-migration_plan" className="field-label">
                      Migration plan <span className="field-tag optional">Optional</span>
                    </label>
                    <textarea
                      id="input-migration_plan"
                      rows={2}
                      value={form.migration_plan}
                      onChange={(e) => onChange('migration_plan', e.target.value)}
                      placeholder="e.g. Phased migration over 6 months with parallel workload validation..."
                      className="textarea-input"
                    />
                  </div>
                </div>
              </section>

              {/* Section 02: Baseline & Scale */}
              <section className="form-section-block">
                <div className="section-block-indicator">
                  <span className="section-badge">02</span>
                </div>
                <div className="section-block-content">
                  <div className="section-title-wrap">
                    <h3 className="section-heading">Baseline &amp; scale</h3>
                    <p className="section-caption">
                      Standardize on a single currency. Compute sizing is specified directly by your team—never inferred.
                    </p>
                  </div>

                  <div className="fields-grid">
                    {field(
                      'currency',
                      'Currency',
                      'ISO 4217 code',
                      'Three-letter international currency code (e.g. USD, EUR, GBP).',
                      { required: true, pattern: '[A-Za-z]{3}', placeholder: 'USD' }
                    )}

                    {field(
                      'fx',
                      'Units per USD',
                      'FX rate',
                      'Exchange rate if converting from standard USD catalog pricing.',
                      { type: 'number', min: 0.000001, step: 'any', required: true, placeholder: '1.0' }
                    )}

                    {numberField(
                      'current',
                      'Current annual cost',
                      form.currency,
                      'Total spend under current platform (license, infrastructure, support).',
                      undefined,
                      'e.g. 420000'
                    )}

                    {field(
                      'horizon',
                      'Forecast horizon',
                      'Years',
                      'Evaluation time window (typically 3 or 5 years) for TCO calculations.',
                      { type: 'number', min: 1, max: 30, step: '1', required: true, placeholder: '3' }
                    )}

                    {numberField(
                      'vcpu_low',
                      'Peak vCPUs · Low',
                      'Cores',
                      'Lower-bound sizing scenario estimate.',
                      undefined,
                      'e.g. 120'
                    )}

                    {numberField(
                      'vcpu_base',
                      'Peak vCPUs · Base',
                      'Cores',
                      'Most likely production operational sizing scenario.',
                      undefined,
                      'e.g. 160'
                    )}

                    {numberField(
                      'vcpu_high',
                      'Peak vCPUs · High',
                      'Cores',
                      'Upper-bound growth sizing scenario estimate.',
                      undefined,
                      'e.g. 220'
                    )}

                    {field(
                      'sensitivity',
                      'Sensitivity range',
                      '% variation',
                      'Percentage by which operating assumptions are varied for sign-flip sensitivity.',
                      { type: 'number', min: 0, max: 100, step: 'any', required: true, placeholder: '25' }
                    )}
                  </div>
                </div>
              </section>

              {/* Section 03: Operating Assumptions */}
              <section className="form-section-block">
                <div className="section-block-indicator">
                  <span className="section-badge">03</span>
                </div>
                <div className="section-block-content">
                  <div className="section-title-wrap">
                    <h3 className="section-heading">Operating assumptions</h3>
                    <p className="section-caption">
                      Account for underlying compute/storage hardware, administration personnel, and migration costs.
                    </p>
                  </div>

                  <div className="fields-grid">
                    {numberField(
                      'infrastructure',
                      'Infrastructure / year',
                      form.currency,
                      'Annual cloud compute, storage, and networking bills.',
                      undefined,
                      'e.g. 90000'
                    )}

                    {numberField(
                      'fte',
                      'Platform staff',
                      'FTE count',
                      'Dedicated database administrators or data platform engineers.',
                      undefined,
                      'e.g. 1.5'
                    )}

                    {numberField(
                      'staff_cost',
                      'Loaded cost / FTE / year',
                      form.currency,
                      'Fully burdened salary, benefits, and overhead per platform engineer.',
                      undefined,
                      'e.g. 60000'
                    )}

                    {numberField(
                      'migration',
                      'One-time migration cost',
                      form.currency,
                      'Consulting, data transfer, pipeline refactoring, and project costs.',
                      undefined,
                      'e.g. 120000'
                    )}

                    {numberField(
                      'parallel_months',
                      'Parallel running',
                      'Months',
                      'Months during which both old and new platforms operate concurrently.',
                      120,
                      'e.g. 3'
                    )}
                  </div>

                  <fieldset className="controls-fieldset">
                    <legend className="fieldset-legend">
                      Controls or deployment needs
                      <span className="legend-tag">Select all that apply</span>
                    </legend>
                    <div className="checkboxes-row">
                      {CONTROLS.map(([value, label]) => {
                        const checked = form.controls.includes(value);
                        return (
                          <label
                            key={value}
                            className={`control-checkbox-label ${checked ? 'selected' : ''}`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) =>
                                onChange(
                                  'controls',
                                  e.target.checked
                                    ? [...form.controls, value]
                                    : form.controls.filter((x) => x !== value)
                                )
                              }
                              className="checkbox-input"
                            />
                            <span>{label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>
                </div>
              </section>

              {/* Form Footer Action */}
              <div className="form-panel-footer">
                <div className="footer-disclaimer">
                  <strong>Your inputs, your assumptions.</strong>
                  <p>All formulas are computed in exact Decimal precision. Review results before sharing.</p>
                </div>

                <StarBorder
                  as="button"
                  type="submit"
                  disabled={busy}
                  className="primary-submit-btn"
                >
                  <Icons.Analysis size={16} />
                  <span>{busy ? 'Calculating...' : 'Build business case'}</span>
                  <Icons.ArrowRight size={14} />
                </StarBorder>
              </div>
            </form>
          </div>
        </div>

        {/* Right Rail Info Panel */}
        <aside className="builder-right-rail">
          <SpotlightCard
            className="rail-spotlight-card"
            spotlightColor="#10b981"
            intensity={0.1}
            ambient={false}
            flare={false}
            grain={0}
          >
            <div className="rail-top">
              <span>THE OUTPUT</span>
              <Icons.Sparkles size={14} />
            </div>
            <div className="paper-icon">
              <Icons.Report size={24} />
            </div>
            <h3 className="rail-heading">
              A case you can
              <br />
              stand behind.
            </h3>
            <p className="rail-desc">
              From raw parameters to a concise board memo, with the reasoning kept strictly in view.
            </p>
            <div className="rail-feature-line">
              <span className="feature-num">01</span>
              <span>A line-by-line cost model</span>
            </div>
            <div className="rail-feature-line">
              <span className="feature-num">02</span>
              <span>Sourced product statements</span>
            </div>
            <div className="rail-feature-line">
              <span className="feature-num">03</span>
              <span>Questions still to resolve</span>
            </div>
          </SpotlightCard>

          <div className="trust-indicator-box">
            <span className="trust-star">✳</span>
            <div>
              <strong>No invented savings.</strong>
              <p>When the evidence or inputs are missing, we explicitly say so.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BuilderView;
