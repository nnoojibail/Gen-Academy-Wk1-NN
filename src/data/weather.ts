import type { Month, WeatherReading } from '../types';
import { MONTHS } from '../types';

/**
 * Static climate normals (approx. average daily hi/lo in °F) per destination
 * airport, indexed Jan→Dec. Driving weather off the *travel month* means editing
 * a destination's travel window updates its weather reading reactively.
 *
 * REAL API: swap this lookup for OpenWeatherMap / WeatherAPI behind `useWeather`,
 * keeping the same `WeatherReading` return shape.
 */
type MonthlyNormals = readonly WeatherReading[]; // length 12, Jan..Dec

const NORMALS_BY_AIRPORT: Record<string, MonthlyNormals> = {
  // Beijing — cold winters, hot humid summers
  PEK: [
    { hi: 35, lo: 18 }, { hi: 41, lo: 23 }, { hi: 54, lo: 34 }, { hi: 70, lo: 46 },
    { hi: 82, lo: 57 }, { hi: 87, lo: 65 }, { hi: 88, lo: 70 }, { hi: 86, lo: 68 },
    { hi: 79, lo: 57 }, { hi: 68, lo: 45 }, { hi: 50, lo: 30 }, { hi: 38, lo: 21 },
  ],
  // Bali (Denpasar) — tropical, warm year-round
  DPS: [
    { hi: 88, lo: 76 }, { hi: 88, lo: 76 }, { hi: 88, lo: 76 }, { hi: 89, lo: 76 },
    { hi: 88, lo: 74 }, { hi: 86, lo: 73 }, { hi: 85, lo: 72 }, { hi: 85, lo: 72 },
    { hi: 86, lo: 73 }, { hi: 88, lo: 74 }, { hi: 88, lo: 75 }, { hi: 88, lo: 76 },
  ],
  // Punta Arenas (Chilean Patagonia) — cool, Southern Hemisphere seasons
  PUQ: [
    { hi: 57, lo: 45 }, { hi: 57, lo: 44 }, { hi: 54, lo: 42 }, { hi: 49, lo: 38 },
    { hi: 43, lo: 34 }, { hi: 39, lo: 31 }, { hi: 38, lo: 30 }, { hi: 41, lo: 31 },
    { hi: 46, lo: 34 }, { hi: 51, lo: 38 }, { hi: 54, lo: 41 }, { hi: 56, lo: 43 },
  ],
  // Phuket — tropical
  HKT: [
    { hi: 89, lo: 76 }, { hi: 91, lo: 77 }, { hi: 92, lo: 78 }, { hi: 92, lo: 79 },
    { hi: 90, lo: 78 }, { hi: 89, lo: 77 }, { hi: 88, lo: 77 }, { hi: 88, lo: 77 },
    { hi: 87, lo: 76 }, { hi: 88, lo: 76 }, { hi: 88, lo: 76 }, { hi: 88, lo: 76 },
  ],
  // Ho Chi Minh City — tropical, hot
  SGN: [
    { hi: 90, lo: 70 }, { hi: 92, lo: 72 }, { hi: 94, lo: 75 }, { hi: 95, lo: 77 },
    { hi: 93, lo: 77 }, { hi: 91, lo: 76 }, { hi: 90, lo: 76 }, { hi: 90, lo: 76 },
    { hi: 89, lo: 75 }, { hi: 89, lo: 75 }, { hi: 89, lo: 74 }, { hi: 88, lo: 71 },
  ],
};

/** Reasonable mild fallback for any airport not in the table. */
const FALLBACK: WeatherReading = { hi: 72, lo: 55 };

const MONTH_INDEX: Record<Month, number> = Object.fromEntries(
  MONTHS.map((m, i) => [m, i]),
) as Record<Month, number>;

/** Get the hi/lo reading for an airport in a given travel month. */
export function getWeather(airportCode: string, month: Month): WeatherReading {
  const normals = NORMALS_BY_AIRPORT[airportCode.toUpperCase()];
  if (!normals) return FALLBACK;
  return normals[MONTH_INDEX[month]] ?? FALLBACK;
}
