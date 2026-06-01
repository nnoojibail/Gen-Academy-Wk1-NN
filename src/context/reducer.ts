import type { AppState, Destination } from '../types';

export type AppAction =
  | { type: 'SET_DEPARTURE'; code: string }
  | { type: 'ADD_DESTINATION'; destination: Destination }
  | { type: 'UPDATE_DESTINATION'; destination: Destination }
  | { type: 'DELETE_DESTINATION'; id: string }
  | { type: 'REORDER_DESTINATIONS'; destinations: Destination[] }
  | { type: 'SET_SELECTED'; id: string | null };

export function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_DEPARTURE':
      return { ...state, departureAirport: action.code };
    case 'ADD_DESTINATION': {
      const maxRank =
        state.destinations.length > 0
          ? Math.max(...state.destinations.map((d) => d.dreamRank))
          : 0;
      const dest: Destination = {
        ...action.destination,
        dreamRank: action.destination.dreamRank || maxRank + 1,
      };
      return { ...state, destinations: [...state.destinations, dest] };
    }
    case 'UPDATE_DESTINATION':
      return {
        ...state,
        destinations: state.destinations.map((d) =>
          d.id === action.destination.id ? action.destination : d,
        ),
      };
    case 'DELETE_DESTINATION': {
      const filtered = state.destinations.filter((d) => d.id !== action.id);
      // Re-normalise ranks to 1..N after deletion
      const normalized = filtered.map((d, i) => ({ ...d, dreamRank: i + 1 }));
      return {
        ...state,
        destinations: normalized,
        selectedDestinationId:
          state.selectedDestinationId === action.id
            ? null
            : state.selectedDestinationId,
      };
    }
    case 'REORDER_DESTINATIONS':
      return { ...state, destinations: action.destinations };
    case 'SET_SELECTED':
      return { ...state, selectedDestinationId: action.id };
  }
}
