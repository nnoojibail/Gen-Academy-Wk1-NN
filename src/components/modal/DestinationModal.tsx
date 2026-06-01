import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { IconLoader2, IconSparkles, IconX } from '@tabler/icons-react';
import type { Destination, Month, VisaRequirement } from '../../types';
import { MONTHS } from '../../types';
import { useAppState } from '../../context/AppStateContext';
import { useVibeSummary } from '../../hooks/useVibeSummary';
import { generateId } from '../../utils/id';
import styles from './DestinationModal.module.css';

// ── Form shape (excludes id, basePrice, vibeSummary) ──────────────────────

interface FormData {
  name: string;
  country: string;
  airportCode: string;
  flightDuration: string;
  flightBudget: number;
  suggestedStayNights: number;
  dreamRank: number;
  travelMonthStart: Month;
  travelMonthEnd: Month;
  visa: VisaRequirement;
}

const EMPTY: FormData = {
  name: '',
  country: '',
  airportCode: '',
  flightDuration: '',
  flightBudget: 800,
  suggestedStayNights: 7,
  dreamRank: 1,
  travelMonthStart: 'January',
  travelMonthEnd: 'February',
  visa: 'not_required',
};

function destToForm(d: Destination): FormData {
  return {
    name: d.name,
    country: d.country,
    airportCode: d.airportCode,
    flightDuration: d.flightDuration,
    flightBudget: d.flightBudget,
    suggestedStayNights: d.suggestedStayNights,
    dreamRank: d.dreamRank,
    travelMonthStart: d.travelMonthStart,
    travelMonthEnd: d.travelMonthEnd,
    visa: d.visa,
  };
}

// ── Vibe section ─────────────────────────────────────────────────────────

interface VibeSectionProps {
  isAddMode: boolean;
  editingDest: Destination | undefined;
  onSummaryGenerated: (text: string) => void;
}

function VibeSection({ isAddMode, editingDest, onSummaryGenerated }: VibeSectionProps) {
  const { vibeState, generate } = useVibeSummary();
  const isLoading = vibeState.status === 'loading';
  const freshText = vibeState.status === 'done' ? vibeState.text : null;

  // Show freshly-generated text first; fall back to the cached version persisted
  // on a previous open so the user always sees something after first generation.
  const displayText = freshText ?? editingDest?.vibeSummary;
  const hasExisting = Boolean(editingDest?.vibeSummary);

  async function handleGenerate() {
    if (!editingDest) return;
    const window =
      editingDest.travelMonthStart === editingDest.travelMonthEnd
        ? editingDest.travelMonthStart
        : `${editingDest.travelMonthStart}–${editingDest.travelMonthEnd}`;
    const text = await generate({
      name: editingDest.name,
      country: editingDest.country,
      travelMonth: window,
    });
    if (text) onSummaryGenerated(text);
  }

  return (
    <div className={styles.vibeSection}>
      <span className={styles.vibeSectionLabel}>Vibe summary</span>

      <button
        type="button"
        className={styles.vibeBtn}
        disabled={isAddMode || isLoading}
        title={isAddMode ? 'Save the destination first, then re-open to generate' : undefined}
        onClick={() => void handleGenerate()}
      >
        {isLoading ? (
          <IconLoader2 size={14} stroke={1.5} className={styles.spin} />
        ) : (
          <IconSparkles size={14} stroke={1.5} />
        )}
        {isLoading ? 'Generating…' : hasExisting || freshText ? 'Regenerate' : 'Generate vibe summary'}
      </button>

      {isAddMode && (
        <p className={styles.vibePlaceholder}>
          Save the destination first, then re-open to generate a vibe summary.
        </p>
      )}
      {!isAddMode && isLoading && (
        <p className={styles.vibePlaceholder}>Generating a travel vibe for {editingDest?.name}…</p>
      )}
      {!isAddMode && !isLoading && displayText && (
        <p className={styles.vibeResult}>{displayText}</p>
      )}
      {!isAddMode && !isLoading && !displayText && (
        <p className={styles.vibePlaceholder}>
          Click the button to generate an AI-powered travel summary.
        </p>
      )}
    </div>
  );
}

// ── Main modal ────────────────────────────────────────────────────────────

export function DestinationModal() {
  const { modalOpen, editingDestId, closeModal, destinations, dispatch } = useAppState();

  const isAddMode = editingDestId === null;
  const editingDest = editingDestId ? destinations.find((d) => d.id === editingDestId) : undefined;

  const [form, setForm] = useState<FormData>(EMPTY);
  const [nameError, setNameError] = useState('');

  // Re-initialise form each time the modal transitions to open.
  // editingDest is intentionally omitted from deps so live context changes
  // (e.g. price refresh) don't reset in-progress edits.
  useEffect(() => {
    if (modalOpen) {
      setForm(editingDest ? destToForm(editingDest) : { ...EMPTY });
      setNameError('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen]);

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (key === 'name') setNameError('');
  }

  function handleSave() {
    if (!form.name.trim()) {
      setNameError('Destination name is required');
      return;
    }

    if (isAddMode) {
      const newDest: Destination = {
        id: generateId(),
        name: form.name.trim(),
        country: form.country.trim(),
        airportCode: form.airportCode.trim().toUpperCase(),
        flightDuration: form.flightDuration.trim(),
        flightBudget: form.flightBudget,
        suggestedStayNights: form.suggestedStayNights,
        dreamRank: form.dreamRank,
        travelMonthStart: form.travelMonthStart,
        travelMonthEnd: form.travelMonthEnd,
        visa: form.visa,
        basePrice: form.flightBudget, // simulate prices from the budget center point
      };
      dispatch({ type: 'ADD_DESTINATION', destination: newDest });
    } else if (editingDest) {
      const updated: Destination = {
        ...editingDest,
        name: form.name.trim(),
        country: form.country.trim(),
        airportCode: form.airportCode.trim().toUpperCase(),
        flightDuration: form.flightDuration.trim(),
        flightBudget: form.flightBudget,
        suggestedStayNights: form.suggestedStayNights,
        dreamRank: form.dreamRank,
        travelMonthStart: form.travelMonthStart,
        travelMonthEnd: form.travelMonthEnd,
        visa: form.visa,
      };
      dispatch({ type: 'UPDATE_DESTINATION', destination: updated });
    }

    closeModal();
  }

  return createPortal(
    <div
      className={`${styles.backdrop} ${modalOpen ? styles.backdropVisible : ''}`}
      onClick={closeModal}
      aria-hidden={!modalOpen}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isAddMode ? 'Add destination' : `Edit ${editingDest?.name ?? 'destination'}`}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            {isAddMode ? 'Add destination' : `Edit ${editingDest?.name ?? 'destination'}`}
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeModal}
            aria-label="Close modal"
          >
            <IconX size={16} stroke={1.5} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          <div className={styles.grid}>
            {/* Destination name */}
            <div className={`${styles.field} ${styles.full}`}>
              <label className={styles.label} htmlFor="modal-name">
                Destination name
              </label>
              <input
                id="modal-name"
                type="text"
                className={styles.input}
                value={form.name}
                placeholder="e.g. Tokyo"
                onChange={(e) => set('name', e.target.value)}
                autoComplete="off"
              />
              {nameError && <span className={styles.error}>{nameError}</span>}
            </div>

            {/* Country */}
            <div className={`${styles.field} ${styles.full}`}>
              <label className={styles.label} htmlFor="modal-country">
                Country
              </label>
              <input
                id="modal-country"
                type="text"
                className={styles.input}
                value={form.country}
                placeholder="e.g. Japan"
                onChange={(e) => set('country', e.target.value)}
                autoComplete="off"
              />
            </div>

            {/* Airport code */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="modal-airport">
                Airport code
              </label>
              <input
                id="modal-airport"
                type="text"
                className={styles.input}
                value={form.airportCode}
                placeholder="e.g. NRT"
                maxLength={4}
                onChange={(e) => set('airportCode', e.target.value.toUpperCase())}
                autoComplete="off"
              />
            </div>

            {/* Flight duration */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="modal-duration">
                Flight duration
              </label>
              <input
                id="modal-duration"
                type="text"
                className={styles.input}
                value={form.flightDuration}
                placeholder="e.g. ~11h"
                onChange={(e) => set('flightDuration', e.target.value)}
                autoComplete="off"
              />
            </div>

            {/* Flight budget */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="modal-budget">
                Flight budget ($)
              </label>
              <input
                id="modal-budget"
                type="number"
                className={styles.input}
                value={form.flightBudget}
                min={0}
                step={50}
                onChange={(e) => set('flightBudget', Math.max(0, Number(e.target.value)))}
              />
            </div>

            {/* Suggested stay */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="modal-stay">
                Suggested stay (nights)
              </label>
              <input
                id="modal-stay"
                type="number"
                className={styles.input}
                value={form.suggestedStayNights}
                min={1}
                step={1}
                onChange={(e) => set('suggestedStayNights', Math.max(1, Number(e.target.value)))}
              />
            </div>

            {/* Dream rank */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="modal-rank">
                Dream rank
              </label>
              <input
                id="modal-rank"
                type="number"
                className={styles.input}
                value={form.dreamRank}
                min={1}
                step={1}
                onChange={(e) => set('dreamRank', Math.max(1, Number(e.target.value)))}
              />
              <span className={styles.hint}>1 = highest priority</span>
            </div>

            {/* Travel window — start to end month */}
            <div className={`${styles.field} ${styles.full}`}>
              <label className={styles.label}>Travel window</label>
              <div className={styles.monthRange}>
                <select
                  className={styles.select}
                  value={form.travelMonthStart}
                  aria-label="Travel window start month"
                  onChange={(e) => set('travelMonthStart', e.target.value as Month)}
                >
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <span className={styles.rangeSep}>to</span>
                <select
                  className={styles.select}
                  value={form.travelMonthEnd}
                  aria-label="Travel window end month"
                  onChange={(e) => set('travelMonthEnd', e.target.value as Month)}
                >
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Visa requirement */}
            <div className={`${styles.field} ${styles.full}`}>
              <label className={styles.label} htmlFor="modal-visa">
                Visa requirement (US passport)
              </label>
              <select
                id="modal-visa"
                className={styles.select}
                value={form.visa}
                onChange={(e) => set('visa', e.target.value as VisaRequirement)}
              >
                <option value="not_required">Not required</option>
                <option value="visa_on_arrival">Visa on arrival</option>
                <option value="required">Required</option>
              </select>
            </div>

            {/* Divider */}
            <hr className={styles.divider} />

            {/* Vibe summary */}
            <VibeSection
              isAddMode={isAddMode}
              editingDest={editingDest}
              onSummaryGenerated={(text) => {
                if (editingDest) {
                  dispatch({
                    type: 'UPDATE_DESTINATION',
                    destination: { ...editingDest, vibeSummary: text },
                  });
                }
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button type="button" className={styles.cancelBtn} onClick={closeModal}>
            Cancel
          </button>
          <button
            type="button"
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={!form.name.trim()}
          >
            {isAddMode ? 'Add destination' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
