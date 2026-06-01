import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import type { Dispatch, ReactNode } from 'react';
import type { AppState, Destination, FlightPrice } from '../types';
import { DEFAULT_DEPARTURE_CODE } from '../data/airports';
import { DEFAULT_DESTINATIONS } from '../data/destinations';
import { rollAllPrices, rollPrice } from '../data/pricing';
import { reducer } from './reducer';
import type { AppAction } from './reducer';
import { loadState, saveState } from './persistence';

const INITIAL_STATE: AppState = {
  departureAirport: DEFAULT_DEPARTURE_CODE,
  destinations: DEFAULT_DESTINATIONS,
  selectedDestinationId: null,
};

interface AppContextValue {
  departureAirport: string;
  destinations: Destination[];
  selectedDestinationId: string | null;
  dispatch: Dispatch<AppAction>;
  prices: Record<string, FlightPrice>;
  refreshPrices: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  modalOpen: boolean;
  editingDestId: string | null;
  openModal: (destId?: string) => void;
  closeModal: () => void;
}

const AppStateContext = createContext<AppContextValue | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE, (init) => {
    const saved = loadState();
    return saved ?? init;
  });

  const [prices, setPrices] = useState<Record<string, FlightPrice>>(() =>
    rollAllPrices(state.destinations),
  );

  // Roll prices for new destinations; drop prices for deleted ones.
  useEffect(() => {
    setPrices((prev) => {
      const destIds = new Set(state.destinations.map((d) => d.id));
      const prevIds = new Set(Object.keys(prev));
      const same =
        destIds.size === prevIds.size && [...destIds].every((id) => prevIds.has(id));
      if (same) return prev;
      const next: Record<string, FlightPrice> = {};
      for (const d of state.destinations) {
        next[d.id] = prev[d.id] ?? rollPrice(d);
      }
      return next;
    });
  }, [state.destinations]);

  // Mirror persisted state to localStorage on every change.
  useEffect(() => {
    saveState(state);
  }, [state]);

  const refreshPrices = useCallback(() => {
    setPrices(rollAllPrices(state.destinations));
  }, [state.destinations]);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDestId, setEditingDestId] = useState<string | null>(null);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const openModal = useCallback((destId?: string) => {
    setEditingDestId(destId ?? null);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingDestId(null);
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      departureAirport: state.departureAirport,
      destinations: state.destinations,
      selectedDestinationId: state.selectedDestinationId,
      dispatch,
      prices,
      refreshPrices,
      drawerOpen,
      openDrawer,
      closeDrawer,
      modalOpen,
      editingDestId,
      openModal,
      closeModal,
    }),
    [
      state.departureAirport,
      state.destinations,
      state.selectedDestinationId,
      prices,
      refreshPrices,
      drawerOpen,
      openDrawer,
      closeDrawer,
      modalOpen,
      editingDestId,
      openModal,
      closeModal,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppContextValue {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
