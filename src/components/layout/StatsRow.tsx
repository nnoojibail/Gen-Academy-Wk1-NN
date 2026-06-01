import { useAppState } from '../../context/AppStateContext';
import { getBudgetStatus, isWithinBudget, budgetDelta } from '../../utils/budgetStatus';
import { getBookingWindow, bestBookingAdvisory } from '../../utils/bookingWindow';
import { formatDelta } from '../../utils/format';
import { StatTile } from './StatTile';
import styles from './StatsRow.module.css';

export function StatsRow() {
  const { destinations, prices } = useAppState();

  const sorted = [...destinations].sort((a, b) => a.dreamRank - b.dreamRank);

  // 1. Within budget
  const dots = sorted.map((d) => ({
    id: d.id,
    filled: isWithinBudget(prices[d.id]?.current ?? Infinity, d.flightBudget),
  }));
  const inBudgetCount = dots.filter((dot) => dot.filled).length;

  // 2. Best deal — lowest price/budget ratio
  let bestDestId: string | null = null;
  let bestRatio = Infinity;
  for (const d of sorted) {
    const current = prices[d.id]?.current;
    if (current === undefined) continue;
    const ratio = current / d.flightBudget;
    if (ratio < bestRatio) {
      bestRatio = ratio;
      bestDestId = d.id;
    }
  }
  const bestDest = bestDestId ? sorted.find((d) => d.id === bestDestId) : null;
  const bestDeltaText = bestDest
    ? formatDelta(budgetDelta(prices[bestDest.id]!.current, bestDest.flightBudget))
    : undefined;

  // 3. Best booking window
  const windows = sorted.map((d) => {
    const current = prices[d.id]?.current ?? d.basePrice;
    return getBookingWindow(getBudgetStatus(current, d.flightBudget));
  });
  const advisory = bestBookingAdvisory(windows);

  // 4. Dream trip — rank 1 is first in sorted array
  const dreamTrip = sorted[0];

  return (
    <div className={styles.row}>
      <StatTile
        variant="inBudget"
        label="Within budget"
        value={`${inBudgetCount} of ${sorted.length}`}
        dots={dots}
      />
      <StatTile
        label="Best deal right now"
        value={bestDest?.name ?? '—'}
        sub={bestDeltaText}
      />
      <StatTile
        label="Best booking window"
        value={advisory}
      />
      <StatTile
        label="Dream trip"
        value={dreamTrip?.name ?? '—'}
        sub={dreamTrip ? `Rank #1 · ${dreamTrip.country}` : undefined}
      />
    </div>
  );
}
