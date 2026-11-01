import React, { useState, useMemo } from 'react';
import Icons from '../Icons';
import Modal from '../common/Modal';
import Badge from '../common/Badge';
import ShinyText from '../reactbits/ShinyText';
import type { Evidence } from '../../types';

interface EvidenceViewProps {
  evidence: Evidence[];
  busy: boolean;
  error: string;
}

export const EvidenceView: React.FC<EvidenceViewProps> = ({
  evidence,
  busy,
  error,
}) => {
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<'all' | 'pricing' | 'security' | 'architecture' | 'migration'>('all');
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);

  const filteredEvidence = useMemo(() => {
    return evidence.filter((item) => {
      const matchSearch =
        search === '' ||
        item.id.toLowerCase().includes(search.toLowerCase()) ||
        item.claim.toLowerCase().includes(search.toLowerCase()) ||
        item.quote.toLowerCase().includes(search.toLowerCase()) ||
        (item.context && item.context.toLowerCase().includes(search.toLowerCase()));

      let matchTopic = true;
      if (selectedTopic === 'pricing') {
        matchTopic = item.claim.toLowerCase().includes('price') || item.claim.toLowerCase().includes('cost') || item.claim.toLowerCase().includes('free') || item.claim.toLowerCase().includes('enterprise') || item.quote.toLowerCase().includes('$');
      } else if (selectedTopic === 'security') {
        matchTopic = item.claim.toLowerCase().includes('security') || item.claim.toLowerCase().includes('soc') || item.claim.toLowerCase().includes('audit') || item.claim.toLowerCase().includes('masking') || item.quote.toLowerCase().includes('security');
      } else if (selectedTopic === 'architecture') {
        matchTopic = item.claim.toLowerCase().includes('lakehouse') || item.claim.toLowerCase().includes('spark') || item.claim.toLowerCase().includes('iceberg') || item.claim.toLowerCase().includes('kubernetes') || item.claim.toLowerCase().includes('compute');
      } else if (selectedTopic === 'migration') {
        matchTopic = item.claim.toLowerCase().includes('migrat') || item.claim.toLowerCase().includes('deploy') || item.claim.toLowerCase().includes('vpc') || item.quote.toLowerCase().includes('migrat');
      }

      return matchSearch && matchTopic;
    });
  }, [evidence, search, selectedTopic]);

  return (
    <div className="evidence-workspace-container">
      {/* Header with Title and Verification Transparency Notice */}
      <div className="evidence-header-card">
        <div className="eyebrow">
          <span className="dot" />
          <ShinyText text="EVIDENCE AUDIT & SOURCE VERIFICATION" speed={4} />
        </div>
        <h1 className="evidence-title">
          Trace every <em>claim.</em>
        </h1>
        <p className="intro evidence-intro">
          A curated, dated evidence pack from IOMETE's public documentation and pricing pages.
          Claims are vendor-stated and verified by exact canonical and structured numerical match—not independent third-party semantic entailment.
        </p>

        {/* Verification Methodology Notice */}
        <div className="verification-transparency-card">
          <div className="transparency-top">
            <span className="transparency-icon">
              <Icons.Info size={16} />
            </span>
            <strong>Evidence Verification Boundaries</strong>
          </div>
          <p className="transparency-desc">
            Status distinguishes between: <strong>Source recorded</strong> (public page archived), <strong>Statement matched</strong> (exact canonical string comparison), and <strong>Financial value checked</strong> (currency and numerical thresholds). Independent semantic entailment and automated fact-checking across arbitrary claims are not implemented.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="evidence-filter-bar">
        <div className="evidence-search-input-wrapper">
          <Icons.Search size={16} className="search-icon" />
          <input
            type="search"
            placeholder="Search claims, quotes, source URLs, or ID numbers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="evidence-search-input"
            aria-label="Search evidence records"
          />
          {search && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              <Icons.Close size={14} />
            </button>
          )}
        </div>

        <div className="topic-filter-tabs">
          {[
            ['all', 'All Records'],
            ['pricing', 'Pricing & Plans'],
            ['security', 'Security & Compliance'],
            ['architecture', 'Architecture & Lakehouse'],
            ['migration', 'Deployment & Migration'],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={`filter-tab-btn ${selectedTopic === id ? 'active' : ''}`}
              onClick={() => setSelectedTopic(id as any)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Status */}
      <div className="evidence-results-meta">
        <span>
          Showing <strong>{filteredEvidence.length}</strong> of {evidence.length} evidence records
          {search && ` matching "${search}"`}
        </span>
      </div>

      {/* Evidence Grid / List */}
      <div className="evidence-grid list">
        {!filteredEvidence.length && !busy ? (
          <div className="empty-evidence-box">
            <Icons.Search size={32} />
            <p>No evidence records match your search query.</p>
            <button
              type="button"
              className="secondary-btn-sm"
              onClick={() => {
                setSearch('');
                setSelectedTopic('all');
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredEvidence.map((e) => (
            <div
              key={e.id}
              className="item evidence-card"
              onClick={() => setSelectedEvidence(e)}
              role="button"
              tabIndex={0}
              onKeyDown={(ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                  setSelectedEvidence(e);
                }
              }}
            >
              <div className="evidence-card-header">
                <div className="evidence-badges-row">
                  <span className="badge">SOURCED</span>
                  <span className="evidence-id-pill">{e.id}</span>
                </div>
                <span className="evidence-date">{e.date}</span>
              </div>

              <strong className="evidence-claim-text">{e.claim}</strong>

              <div className="evidence-quote-box">
                <small>
                  {e.excerpt_kind === 'combined snippets'
                    ? 'Selected source snippets: '
                    : 'Source excerpt: '}
                  "{e.quote}"
                </small>
              </div>

              <div className="evidence-card-footer">
                <span className="source-domain">
                  <Icons.ExternalLink size={12} /> iomete.com
                </span>
                <span className="inspect-details-link">
                  View record details <Icons.ChevronRight size={12} />
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Evidence Detail Modal */}
      {selectedEvidence && (
        <Modal
          isOpen={Boolean(selectedEvidence)}
          onClose={() => setSelectedEvidence(null)}
          title={`Evidence Record: ${selectedEvidence.id}`}
          maxWidth="640px"
          footer={
            <div className="modal-actions-right">
              <a
                href={selectedEvidence.url}
                target="_blank"
                rel="noreferrer"
                className="modal-external-link"
              >
                Open Original Source ↗
              </a>
              <button
                type="button"
                className="secondary-btn-sm"
                onClick={() => setSelectedEvidence(null)}
              >
                Close
              </button>
            </div>
          }
        >
          <div className="evidence-modal-content">
            <div className="modal-field-group">
              <label className="modal-label">Primary Claim</label>
              <p className="modal-claim-bold">{selectedEvidence.claim}</p>
            </div>

            <div className="modal-field-group">
              <label className="modal-label">Direct Source Excerpt</label>
              <blockquote className="modal-quote">
                "{selectedEvidence.quote}"
              </blockquote>
            </div>

            <div className="modal-meta-grid">
              <div>
                <label className="modal-label">Source URL</label>
                <a
                  href={selectedEvidence.url}
                  target="_blank"
                  rel="noreferrer"
                  className="modal-url-link"
                >
                  {selectedEvidence.url}
                </a>
              </div>
              <div>
                <label className="modal-label">Retrieval Date</label>
                <p className="modal-text">{selectedEvidence.date}</p>
              </div>
              <div>
                <label className="modal-label">Excerpt Kind</label>
                <p className="modal-text">
                  {selectedEvidence.excerpt_kind || 'Direct snippet'}
                </p>
              </div>
              <div>
                <label className="modal-label">Verification Class</label>
                <p className="modal-text">Vendor-stated public record</p>
              </div>
            </div>

            {selectedEvidence.context && (
              <div className="modal-field-group">
                <label className="modal-label">Context &amp; Caveats</label>
                <p className="modal-context-note">{selectedEvidence.context}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EvidenceView;
