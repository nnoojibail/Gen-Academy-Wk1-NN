import type { Destination } from '../types';

/** Build the route string shown under a destination, e.g. "SFO → NRT · ~11h". */
export function routeString(departureCode: string, destination: Destination): string {
  return `${departureCode} → ${destination.airportCode} · ${destination.flightDuration}`;
}
