import type { Month } from '../types';
import { MONTHS } from '../types';

const MONTH_IDX: Record<Month, number> = Object.fromEntries(
  MONTHS.map((m, i) => [m, i]),
) as Record<Month, number>;

export interface MonthYear {
  monthIndex: number; // 0-based
  year: number;
}

// ── Year resolution ──────────────────────────────────────────────────────────

/**
 * Next upcoming year for a given travel-window start month.
 * If the month is still ahead this calendar year → this year.
 * If it has already passed (or is the current month) → next year.
 */
export function getTravelStartYear(month: Month, today: Date): number {
  return MONTH_IDX[month] > today.getMonth()
    ? today.getFullYear()
    : today.getFullYear() + 1;
}

/**
 * End-year for a travel window.
 * Same year as the start unless the end month is earlier in the calendar
 * than the start month (i.e. a cross-year range like Dec→Jan).
 */
export function getTravelEndYear(
  startMonth: Month,
  startYear: number,
  endMonth: Month,
): number {
  return MONTH_IDX[endMonth] >= MONTH_IDX[startMonth] ? startYear : startYear + 1;
}

// ── Formatting ───────────────────────────────────────────────────────────────

function abbr(month: Month): string {
  return month.slice(0, 3);
}

function abbrYear(year: number): string {
  return `'${String(year).slice(2)}`;
}

/**
 * Format a travel window, e.g.:
 *   same year   → "Sep–Oct '26"
 *   cross year  → "Dec '26–Jan '27"
 *   single month→ "Sep '26"
 */
export function formatTravelWindow(
  startMonth: Month,
  startYear: number,
  endMonth: Month,
  endYear: number,
): string {
  if (startMonth === endMonth) {
    return `${abbr(startMonth)} ${abbrYear(startYear)}`;
  }
  if (startYear === endYear) {
    return `${abbr(startMonth)}–${abbr(endMonth)} ${abbrYear(startYear)}`;
  }
  return `${abbr(startMonth)} ${abbrYear(startYear)}–${abbr(endMonth)} ${abbrYear(endYear)}`;
}

// ── Buying window ─────────────────────────────────────────────────────────────

/** Subtract N months from a MonthYear, wrapping the year. */
function subtractMonths(my: MonthYear, months: number): MonthYear {
  let m = my.monthIndex - months;
  let y = my.year;
  while (m < 0) {
    m += 12;
    y -= 1;
  }
  return { monthIndex: m, year: y };
}

/**
 * Buying window = 2-month range starting 4 months before travel-window start
 * (i.e. 4 and 3 months before departure).
 */
export function getBuyingWindow(
  travelStartMonth: Month,
  travelStartYear: number,
): { start: MonthYear; end: MonthYear } {
  const base: MonthYear = { monthIndex: MONTH_IDX[travelStartMonth], year: travelStartYear };
  return { start: subtractMonths(base, 4), end: subtractMonths(base, 3) };
}

/**
 * Format a MonthYear buying window, e.g.:
 *   same year   → "May–Jun '26"
 *   cross year  → "Dec '26–Jan '27"
 */
export function formatBuyingWindow(start: MonthYear, end: MonthYear): string {
  const s = MONTHS[start.monthIndex];
  const e = MONTHS[end.monthIndex];
  if (!s || !e) return '';
  if (start.year === end.year) {
    return `${s.slice(0, 3)}–${e.slice(0, 3)} ${abbrYear(start.year)}`;
  }
  return `${s.slice(0, 3)} ${abbrYear(start.year)}–${e.slice(0, 3)} ${abbrYear(end.year)}`;
}

/**
 * True when today is on or after the buying-window start —
 * meaning the window is either currently active or has already passed.
 * Both cases call for acting now.
 */
export function isBuyNow(buyStart: MonthYear, today: Date): boolean {
  const y = today.getFullYear();
  const m = today.getMonth();
  return y > buyStart.year || (y === buyStart.year && m >= buyStart.monthIndex);
}
