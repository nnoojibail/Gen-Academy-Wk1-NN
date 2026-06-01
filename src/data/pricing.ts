import type { Destination, FlightPrice } from '../types';

/**
 * Mock flight-price simulation. The "current" price is the destination's
 * `basePrice` jittered by ±20%, re-rolled on load and on "Refresh prices".
 *
 * REAL API: replace `rollPrice` with a Skyscanner / Google Flights lookup behind
 * `useFlightPrices`, keyed by departure + destination airport, returning the same
 * `FlightPrice` shape.
 */
const JITTER = 0.2; // ±20%

/** Roll one simulated current price for a destination. */
export function rollPrice(destination: Destination): FlightPrice {
  const base = destination.basePrice || destination.flightBudget;
  const factor = 1 + (Math.random() * 2 - 1) * JITTER; // [0.8, 1.2]
  const current = Math.round(base * factor);
  return { destinationId: destination.id, current };
}

/** Roll prices for every destination, keyed by id for O(1) lookup. */
export function rollAllPrices(destinations: Destination[]): Record<string, FlightPrice> {
  const out: Record<string, FlightPrice> = {};
  for (const d of destinations) {
    out[d.id] = rollPrice(d);
  }
  return out;
}
