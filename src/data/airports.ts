import type { Airport } from '../types';

/**
 * Airport lookup used for the departure chip label, route strings, and the
 * settings-drawer search. Includes the Bay Area / SoCal departure options
 * (quick-pick chips) plus the seed destination airports and a few common hubs.
 *
 * REAL API: replace this static list with an airport autocomplete service
 * (e.g. Amadeus / Skyscanner places) behind the same `Airport` shape.
 */
export const AIRPORTS: Airport[] = [
  // Departure-side (US West Coast)
  { code: 'SFO', city: 'San Francisco', name: 'San Francisco International' },
  { code: 'OAK', city: 'Oakland', name: 'Oakland International' },
  { code: 'SJC', city: 'San Jose', name: 'Norman Y. Mineta San José International' },
  { code: 'LAX', city: 'Los Angeles', name: 'Los Angeles International' },
  { code: 'SEA', city: 'Seattle', name: 'Seattle–Tacoma International' },
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy International' },
  // Seed destination airports
  { code: 'PEK', city: 'Beijing', name: 'Beijing Capital International' },
  { code: 'DPS', city: 'Bali (Denpasar)', name: 'Ngurah Rai International' },
  { code: 'PUQ', city: 'Punta Arenas', name: 'Presidente Carlos Ibáñez del Campo' },
  { code: 'HKT', city: 'Phuket', name: 'Phuket International' },
  { code: 'SGN', city: 'Ho Chi Minh City', name: 'Tan Son Nhat International' },
];

/** Codes shown as quick-pick chips in the settings drawer. */
export const QUICK_PICK_DEPARTURE_CODES = ['SFO', 'OAK', 'SJC', 'LAX'] as const;

export const DEFAULT_DEPARTURE_CODE = 'SFO';

const AIRPORT_BY_CODE: Record<string, Airport> = Object.fromEntries(
  AIRPORTS.map((a) => [a.code, a]),
);

/** Look up an airport by code; falls back to a bare record if unknown. */
export function getAirport(code: string): Airport {
  return (
    AIRPORT_BY_CODE[code.toUpperCase()] ?? {
      code: code.toUpperCase(),
      city: code.toUpperCase(),
      name: code.toUpperCase(),
    }
  );
}

/** Case-insensitive search by code or city, for the drawer's airport input. */
export function searchAirports(query: string): Airport[] {
  const q = query.trim().toLowerCase();
  if (!q) return AIRPORTS;
  return AIRPORTS.filter(
    (a) =>
      a.code.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q),
  );
}
