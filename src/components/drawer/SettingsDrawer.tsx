import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { IconX } from '@tabler/icons-react';
import type { Destination } from '../../types';
import { useAppState } from '../../context/AppStateContext';
import { DepartureSection } from './DepartureSection';
import { DestinationEditRow } from './DestinationEditRow';
import styles from './SettingsDrawer.module.css';

export function SettingsDrawer() {
  const { drawerOpen, closeDrawer, departureAirport, destinations, dispatch, openModal } =
    useAppState();

  const [draftDeparture, setDraftDeparture] = useState(departureAirport);
  const [draftDestinations, setDraftDestinations] = useState<Destination[]>([]);
  // Tracks whether the draft was populated from a real drawer-open event.
  const [draftReady, setDraftReady] = useState(false);

  // Re-initialise draft exactly once each time the drawer transitions to open.
  // departureAirport and destinations are intentionally omitted from deps so we
  // don't reset edits-in-progress when prices refresh while the drawer is open.
  useEffect(() => {
    if (drawerOpen) {
      setDraftDeparture(departureAirport);
      setDraftDestinations([...destinations].sort((a, b) => a.dreamRank - b.dreamRank));
      setDraftReady(true);
    } else {
      setDraftReady(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // prevents drag on button clicks
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = draftDestinations.findIndex((d) => d.id === String(active.id));
    const newIdx = draftDestinations.findIndex((d) => d.id === String(over.id));
    const reordered = arrayMove(draftDestinations, oldIdx, newIdx);
    setDraftDestinations(reordered.map((d, i) => ({ ...d, dreamRank: i + 1 })));
  }

  function handleDestChange(updated: Destination) {
    setDraftDestinations((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  }

  function handleDestDelete(id: string) {
    setDraftDestinations((prev) => {
      const filtered = prev.filter((d) => d.id !== id);
      return filtered.map((d, i) => ({ ...d, dreamRank: i + 1 }));
    });
  }

  function handleSave() {
    // Guard: never save if the draft was never populated (protects against
    // accidental dispatch with the initial empty array before drawer opens).
    if (!draftReady) {
      closeDrawer();
      return;
    }
    if (draftDeparture !== departureAirport) {
      dispatch({ type: 'SET_DEPARTURE', code: draftDeparture });
    }
    // REORDER_DESTINATIONS replaces the full array — captures reorder, budget, and stay edits.
    dispatch({ type: 'REORDER_DESTINATIONS', destinations: draftDestinations });
    closeDrawer();
  }

  function handleCancel() {
    closeDrawer();
  }

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={`${styles.backdrop} ${drawerOpen ? styles.backdropVisible : ''}`}
        onClick={handleCancel}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-label="Settings"
        aria-modal="true"
        className={`${styles.drawer} ${drawerOpen ? styles.drawerOpen : ''}`}
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Settings</h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={handleCancel}
            aria-label="Close settings"
          >
            <IconX size={16} stroke={1.5} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className={styles.body}>
          {/* Section 1 — Departure airport */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Departure airport</h3>
            <DepartureSection value={draftDeparture} onChange={setDraftDeparture} />
          </div>

          {/* Section 2 — Destinations & budgets */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Destinations & budgets</h3>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={draftDestinations.map((d) => d.id)}
                strategy={verticalListSortingStrategy}
              >
                {draftDestinations.map((dest) => (
                  <DestinationEditRow
                    key={dest.id}
                    destination={dest}
                    onChange={handleDestChange}
                    onDelete={handleDestDelete}
                    onEdit={(id) => openModal(id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
            Cancel
          </button>
          <button type="button" className={styles.saveBtn} onClick={handleSave}>
            Save changes
          </button>
        </div>
      </div>
    </>,
    document.body,
  );
}
