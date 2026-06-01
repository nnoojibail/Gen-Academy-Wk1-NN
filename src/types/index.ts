// ───────────────────────────────────────────────────────────────────────────
// Core domain types for the Bucket List Travel Dashboard
// ───────────────────────────────────────────────────────────────────────────

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

export type Month = (typeof MONTHS)[number];

/** Visa requirement for a US passport holder. */
export type VisaRequirement = 'not_required' | 'visa_on_arrival' | 'required';

/** Status badge derived from current flight price vs. the per-destination budget. */
export type BudgetStatus = 'deal' | 'close' | 'over' | 'watching';

/** Booking urgency label, derived from the budget status. */
export type BookingWindow = 'book_now' | '3_4_wks' | '8_10_wks' | 'wait';

/**
 * A single bucket-list destination. Only user-authored fields live here and are
 * persisted to localStorage. Simulated price/weather are derived via hooks.
 *
 * `basePrice` is mock-data seed: the center point the simulated current price
 * randomizes around (±20%). New destinations added via the modal default it to
 * the flight budget.
 */
export interface Destination {
  id: string;
  name: string;
  country: string;
  airportCode: string;
  /** Human-readable flight duration from the departure airport, e.g. "~12h". */
  flightDuration: string;
  /** User-set flight budget threshold in USD. */
  flightBudget: number;
  /** User-set suggested stay in nights. */
  suggestedStayNights: number;
  /** Dream rank / priority — 1 is highest. Drag-to-reorder updates this. */
  dreamRank: number;
  /** Preferred travel month; drives the weather reading shown in the table. */
  travelMonth: Month;
  visa: VisaRequirement;
  /** Mock pricing center point in USD. */
  basePrice: number;
  /** Cached AI-generated vibe summary (filled on demand, persisted once generated). */
  vibeSummary?: string;
}

export interface Airport {
  code: string;
  city: string;
  /** Full airport name, e.g. "San Francisco International". */
  name: string;
}

export interface WeatherReading {
  hi: number;
  lo: number;
}

/** Simulated current round-trip flight price for a destination. */
export interface FlightPrice {
  destinationId: string;
  current: number;
}

/** The full persisted application state. */
export interface AppState {
  /** Departure airport code, e.g. "SFO". */
  departureAirport: string;
  destinations: Destination[];
  /** Destination currently focused in the flight-tracker panel. */
  selectedDestinationId: string | null;
}
