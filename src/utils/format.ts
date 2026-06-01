import type { VisaRequirement } from '../types';

/** Whole-dollar USD, e.g. 1050 → "$1,050". */
export function formatUSD(amount: number): string {
  return `$${Math.round(amount).toLocaleString('en-US')}`;
}

/** Signed budget delta as a human phrase, e.g. -113 → "$113 under", 20 → "$20 over". */
export function formatDelta(delta: number): string {
  const abs = Math.abs(Math.round(delta));
  if (delta === 0) return 'on budget';
  return `${formatUSD(abs)} ${delta < 0 ? 'under' : 'over'}`;
}

export const VISA_LABEL: Record<VisaRequirement, string> = {
  not_required: 'Not required',
  visa_on_arrival: 'Visa on arrival',
  required: 'Required',
};
