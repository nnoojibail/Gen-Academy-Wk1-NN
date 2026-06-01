import type { BudgetStatus } from '../types';

/**
 * Derive the status badge from current price vs. budget.
 *
 *   Deal     price ≤ 85% of budget
 *   Watching 85% < price < 95%   (under budget, worth watching)
 *   Close    95% ≤ price ≤ 105%  (within ±5% of budget)
 *   Over     price > 105% of budget
 *
 * (The brief's "Watching 85–100%" and "Close within ±5%" overlap at 95–100%;
 * Close takes precedence in that band, which matches the "Close" intent.)
 */
export function getBudgetStatus(current: number, budget: number): BudgetStatus {
  if (budget <= 0) return 'watching';
  const ratio = current / budget;
  if (ratio <= 0.85) return 'deal';
  if (ratio < 0.95) return 'watching';
  if (ratio <= 1.05) return 'close';
  return 'over';
}

export const STATUS_LABEL: Record<BudgetStatus, string> = {
  deal: 'Deal',
  close: 'Close',
  over: 'Over',
  watching: 'Watching',
};

/** True when the current price is at or under budget (drives row tint + stats). */
export function isWithinBudget(current: number, budget: number): boolean {
  return current <= budget;
}

/** Signed delta vs. budget: negative = under (good), positive = over. */
export function budgetDelta(current: number, budget: number): number {
  return current - budget;
}
