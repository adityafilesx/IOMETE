import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { api } from './api';
import type { Analysis, Evidence, FormDataCase, SavedCase } from './types';
import TopBar from './components/layout/TopBar';
import Sidebar, { NavView } from './components/layout/Sidebar';
import OverviewView from './components/views/OverviewView';
import BuilderView from './components/views/BuilderView';
import AnalysisView from './components/views/AnalysisView';
import EvidenceView from './components/views/EvidenceView';
import SavedCasesView from './components/views/SavedCasesView';
import ReportPreviewView from './components/views/ReportPreviewView';
import Toast, { ToastMessage } from './components/common/Toast';
import './style.css';

const initial: FormDataCase = {
  name: '',
  role: 'CFO',
  platform: '',
  skills: 'unknown',
  objective: '',
  industry: '',
  hosting: '',
  migration_plan: '',
  currency: 'USD',
  fx: '1',
  current: '',
  horizon: '3',
  vcpu_low: '',
  vcpu_base: '',
  vcpu_high: '',
  sensitivity: '25',
  infrastructure: '',
  fte: '',
  staff_cost: '',
  migration: '',
  parallel_months: '',
  controls: [],
};

const example: FormDataCase = {
  ...initial,
  name: 'Illustrative SaaS comparison',
  platform: 'Example SaaS platform',
  skills: 'yes',
  objective: 'Evaluate the cost and operating implications of a platform change.',
  current: '420000',
  vcpu_low: '120',
  vcpu_base: '160',
  vcpu_high: '220',
  infrastructure: '90000',
  fte: '1.5',
  staff_cost: '60000',
  migration: '120000',
  parallel_months: '3',
  controls: ['auditing'],
};

export function App() {
  const [form, setForm] = useState<FormDataCase>(initial);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [view, setView] = useState<NavView>('builder');
  const [cases, setCases] = useState<SavedCase[]>([]);
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, description?: string) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const change = (key: keyof FormDataCase, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setAnalysis(null);
    setSaved(false);
  };

  // Run financial analysis engine
  const run = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = await api.analyze(form);
      setAnalysis(result);
      addToast('success', 'Analysis Completed', 'Financial metrics and scenarios updated successfully.');
      setTimeout(() => {
        document.getElementById('result')?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
        });
      }, 50);
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      addToast('error', 'Calculation Error', msg);
    } finally {
      setBusy(false);
    }
  };

  // Switch navigation view
  const navigateTo = async (next: NavView) => {
    setView(next);
    setError('');
    setMobileMenuOpen(false);
    setBusy(true);
    try {
      if (next === 'saved' || next === 'overview') {
        const c = await api.cases();
        setCases(c);
      }
      if (next === 'evidence') {
        const ev = await api.evidence();
        setEvidence(ev);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  // Open saved case
  const openCase = async (id: number) => {
    setError('');
    setBusy(true);
    try {
      const data = await api.get(id);
      const restored = { ...initial, ...data, id };
      setForm(restored);
      const res = await api.analyze(restored);
      setAnalysis(res);
      setView('builder');
      setSaved(true);
      addToast('info', 'Case Restored', `Opened saved case: ${restored.name}`);
      setTimeout(() => {
        document.getElementById('result')?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
            ? 'auto'
            : 'smooth',
        });
      }, 50);
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      addToast('error', 'Open Failed', msg);
    } finally {
      setBusy(false);
    }
  };

  // Save current case
  const saveCase = async () => {
    setBusy(true);
    setError('');
    try {
      const r = await api.save(form);
      setForm({ ...form, id: r.id });
      setSaved(true);
      addToast('success', 'Case Saved', 'Saved case snapshot to local repository.');
      // Refresh cases list in background
      api.cases().then(setCases).catch(() => {});
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      addToast('error', 'Save Failed', msg);
    } finally {
      setBusy(false);
    }
  };

  // Delete saved case
  const removeCase = async (id: number) => {
    setBusy(true);
    setError('');
    try {
      await api.remove(id);
      const refreshed = await api.cases();
      setCases(refreshed);
      if (form.id === id) {
        setForm({ ...form, id: undefined });
      }
      addToast('info', 'Case Deleted', 'Removed case from local repository.');
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      addToast('error', 'Delete Failed', msg);
    } finally {
      setBusy(false);
    }
  };

  // Download binary export (XLSX, PDF, Word)
  const download = async (kind: 'xlsx' | 'pdf' | 'docx') => {
    setBusy(true);
    setError('');
    try {
      await api.download(kind, form);
      addToast(
        'success',
        'Download Ready',
        `Successfully generated ProofDesk.${kind}`
      );
    } catch (err) {
      const msg = (err as Error).message;
      setError(msg);
      addToast('error', 'Export Failed', msg);
    } finally {
      setBusy(false);
    }
  };

  // Download CSV export
  const downloadCsv = () => {
    if (!analysis) return;
    try {
      const rows: (string | number | null)[][] = [
        [
          'Scenario',
          'vCPU',
          'Plan',
          'License',
          'Staff',
          'Parallel',
          'One-time',
          'Recurring',
          'Annualized',
          'Annual change',
          'TCO',
          'Baseline TCO',
          'Payback years',
        ],
        ...analysis.calculation.scenarios.map((s) => [
          s.name,
          s.vcpu,
          s.plan,
          s.license,
          s.staff,
          s.parallel,
          s.one_time,
          s.recurring,
          s.annualized,
          s.annual_change,
          s.tco,
          s.baseline_tco,
          s.payback,
        ]),
        [],
        ['Input', 'Value'],
        ...Object.entries(form).map(([k, v]) => [
          k,
          Array.isArray(v) ? v.join('; ') : v ?? '',
        ]),
      ];
      const text = rows
        .map((row) =>
          row
            .map((v) => {
              let s = String(v ?? '');
              if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
              return `"${s.replaceAll('"', '""')}"`;
            })
            .join(',')
        )
        .join('\r\n');
      const url = URL.createObjectURL(
        new Blob([text], { type: 'text/csv;charset=utf-8' })
      );
      const a = document.createElement('a');
      a.href = url;
      a.download = 'proofdesk-case.csv';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      addToast('success', 'CSV Exported', 'Downloaded proofdesk-case.csv.');
    } catch (err) {
      addToast('error', 'Export Failed', (err as Error).message);
    }
  };

  const loadExample = () => {
    setForm({ ...example });
    setAnalysis(null);
    setSaved(false);
    setView('builder');
    addToast('info', 'Example Loaded', 'Populated illustrative SaaS comparison data.');
  };

  const handleNewCase = () => {
    setForm({ ...initial });
    setAnalysis(null);
    setSaved(false);
    setView('builder');
    addToast('info', 'New Case', 'Started a blank business case.');
  };

  // Initial data loading
  useEffect(() => {
    document.title = 'ProofDesk — Business case builder';
    api.cases().then(setCases).catch(() => {});
    api.evidence().then(setEvidence).catch(() => {});
  }, []);

  return (
    <div className="proofdesk-app">
      {/* Top Navigation Bar */}
      <TopBar
        caseName={form.name}
        isSaved={form.name ? saved : undefined}
        onNewCase={handleNewCase}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Layout Grid */}
      <div className="app-layout">
        {/* Navigation Sidebar */}
        <Sidebar
          currentView={view}
          onNavigate={navigateTo}
          hasAnalysis={Boolean(analysis)}
          savedCasesCount={cases.length}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Workspace Content Container */}
        <main className="main-content">
          {/* Breadcrumb Navigation */}
          <nav className="breadcrumb-bar" aria-label="Breadcrumb">
            <span className="breadcrumb-crumb">WORKSPACE</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">
              {view === 'overview'
                ? 'OVERVIEW'
                : view === 'builder'
                ? 'BUSINESS CASE'
                : view === 'analysis'
                ? 'ANALYSIS & SCENARIOS'
                : view === 'saved'
                ? 'SAVED CASES'
                : view === 'evidence'
                ? 'EVIDENCE LIBRARY'
                : 'REPORT & EXPORTS'}
            </span>
          </nav>

          {/* Global Status/Error Banners */}
          {error && (
            <div className="form-error-banner" role="alert" style={{ marginBottom: 20 }}>
              <span>{error}</span>
            </div>
          )}

          {busy && (
            <div className="system-busy-indicator" role="status" style={{ marginBottom: 16 }}>
              <p>Working…</p>
            </div>
          )}

          {/* VIEW: OVERVIEW */}
          {view === 'overview' && (
            <OverviewView
              form={form}
              savedCases={cases}
              analysis={analysis}
              onNewCase={handleNewCase}
              onOpenCase={openCase}
              onNavigate={navigateTo}
              onLoadExample={loadExample}
            />
          )}

          {/* VIEW: BUILDER / ANALYSIS */}
          {view === 'builder' && (
            <>
              <BuilderView
                form={form}
                onChange={change}
                onSubmit={run}
                onLoadExample={loadExample}
                busy={busy}
                error={error}
              />

              {analysis && (
                <div style={{ marginTop: 36 }}>
                  <AnalysisView
                    form={form}
                    analysis={analysis}
                    busy={busy}
                    saved={saved}
                    onSave={saveCase}
                    onDownload={download}
                    onDownloadCsv={downloadCsv}
                    onNavigate={navigateTo}
                  />
                </div>
              )}
            </>
          )}

          {/* VIEW: ANALYSIS WORKSPACE STANDALONE */}
          {view === 'analysis' && (
            <>
              {analysis ? (
                <AnalysisView
                  form={form}
                  analysis={analysis}
                  busy={busy}
                  saved={saved}
                  onSave={saveCase}
                  onDownload={download}
                  onDownloadCsv={downloadCsv}
                  onNavigate={navigateTo}
                />
              ) : (
                <div className="report-empty-state">
                  <h2>No Analysis Generated Yet</h2>
                  <p>Configure your baseline inputs in the Business Case Builder and click "Build business case".</p>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => setView('builder')}
                  >
                    Go to Builder
                  </button>
                </div>
              )}
            </>
          )}

          {/* VIEW: EVIDENCE LIBRARY */}
          {view === 'evidence' && (
            <EvidenceView
              evidence={evidence}
              busy={busy}
              error={error}
            />
          )}

          {/* VIEW: SAVED CASES */}
          {view === 'saved' && (
            <SavedCasesView
              cases={cases}
              busy={busy}
              onOpen={openCase}
              onRemove={removeCase}
              onNewCase={handleNewCase}
            />
          )}

          {/* VIEW: REPORT PREVIEW & EXPORTS */}
          {view === 'report' && (
            <ReportPreviewView
              form={form}
              analysis={analysis}
              busy={busy}
              onDownload={download}
              onDownloadCsv={downloadCsv}
              onNavigateToBuilder={() => setView('builder')}
            />
          )}
        </main>
      </div>

      {/* Floating Action Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
