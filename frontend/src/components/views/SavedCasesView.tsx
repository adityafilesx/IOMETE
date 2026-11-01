import React, { useState, useMemo } from 'react';
import Icons from '../Icons';
import Modal from '../common/Modal';
import ShinyText from '../reactbits/ShinyText';
import type { SavedCase } from '../../types';

interface SavedCasesViewProps {
  cases: SavedCase[];
  busy: boolean;
  onOpen: (id: number) => void;
  onRemove: (id: number) => void;
  onNewCase: () => void;
}

export const SavedCasesView: React.FC<SavedCasesViewProps> = ({
  cases,
  busy,
  onOpen,
  onRemove,
  onNewCase,
}) => {
  const [search, setSearch] = useState('');
  const [caseToDelete, setCaseToDelete] = useState<SavedCase | null>(null);

  const filteredCases = useMemo(() => {
    return cases.filter(
      (c) =>
        search === '' ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        String(c.id).includes(search)
    );
  }, [cases, search]);

  const confirmDelete = () => {
    if (caseToDelete) {
      onRemove(caseToDelete.id);
      setCaseToDelete(null);
    }
  };

  return (
    <div className="saved-cases-container">
      {/* Page Header */}
      <div className="saved-cases-header">
        <div className="saved-header-left">
          <div className="eyebrow">
            <span className="dot" />
            <ShinyText text="LOCAL REPOSITORY PERSISTENCE" speed={4} />
          </div>
          <h1 className="saved-title">
            Saved <em>cases.</em>
          </h1>
          <p className="intro saved-intro">
            Cases are stored securely on this computer via SQLite/PostgreSQL with versioned analysis snapshots.
          </p>
        </div>

        <div className="saved-header-actions">
          <button
            type="button"
            className="primary-btn-sm"
            onClick={onNewCase}
          >
            <Icons.Plus size={15} />
            <span>Create New Case</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="saved-cases-bar">
        <div className="saved-search-wrapper">
          <Icons.Search size={16} className="search-icon" />
          <input
            type="search"
            placeholder="Search saved cases by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="saved-search-input"
            aria-label="Search saved cases"
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

        <div className="saved-count-pill">
          <span>{filteredCases.length} Cases Stored</span>
        </div>
      </div>

      {/* Cases List */}
      <div className="saved-cases-list list">
        {!filteredCases.length && !busy ? (
          <div className="empty-saved-box">
            <Icons.FolderOpen size={36} />
            <p>
              {cases.length === 0
                ? 'No saved cases yet. Build a case and choose Save case.'
                : `No saved cases match "${search}".`}
            </p>
            {cases.length === 0 && (
              <button
                type="button"
                className="primary-btn-sm"
                onClick={onNewCase}
              >
                Start your first case
              </button>
            )}
          </div>
        ) : (
          filteredCases.map((c) => (
            <div key={c.id} className="item saved-case-item">
              <div className="saved-case-info">
                <div className="case-id-tag">ID #{c.id}</div>
                <strong className="saved-case-name">{c.name}</strong>
                <small className="saved-case-date">Updated {c.updated}</small>
              </div>

              <div className="actions saved-case-actions">
                <button
                  type="button"
                  className="secondary open-case-btn"
                  onClick={() => onOpen(c.id)}
                  title="Open and restore case snapshot"
                >
                  Open
                </button>

                <button
                  type="button"
                  className="secondary delete-case-btn"
                  onClick={() => setCaseToDelete(c)}
                  title="Delete case from local repository"
                >
                  <Icons.Trash size={14} />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {caseToDelete && (
        <Modal
          isOpen={Boolean(caseToDelete)}
          onClose={() => setCaseToDelete(null)}
          title="Delete Saved Case"
          footer={
            <div className="modal-actions-right">
              <button
                type="button"
                className="secondary-btn-sm"
                onClick={() => setCaseToDelete(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="danger-btn-sm"
                onClick={confirmDelete}
              >
                Delete Case
              </button>
            </div>
          }
        >
          <div className="delete-modal-body">
            <p>
              Are you sure you want to delete <strong>{caseToDelete.name}</strong> (ID #{caseToDelete.id})?
            </p>
            <p className="delete-warning-note">
              This action permanently removes the stored case inputs and historical analysis snapshot from the local database.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default SavedCasesView;
