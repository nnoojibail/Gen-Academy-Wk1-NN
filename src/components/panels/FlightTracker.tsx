import { useAppState } from '../../context/AppStateContext';
import { getBudgetStatus, budgetDelta } from '../../utils/budgetStatus';
import { formatUSD, formatDelta } from '../../utils/format';
import { routeString } from '../../utils/routeString';
import { RankBadge } from '../ui/Badge';
import { BudgetGauge } from '../ui/BudgetGauge';
import styles from './FlightTracker.module.css';

export function FlightTracker() {
  const { destinations, prices, selectedDestinationId, departureAirport } = useAppState();

  const sorted = [...destinations].sort((a, b) => a.dreamRank - b.dreamRank);
  const selected =
    (selectedDestinationId ? destinations.find((d) => d.id === selectedDestinationId) : null) ??
    sorted[0];

  if (!selected) {
    return (
      <div className={styles.card}>
        <span className={styles.cardTitle}>Flight tracker</span>
        <div className={styles.empty}>
          <p className={styles.emptyText}>Add a destination to track flight prices.</p>
        </div>
      </div>
    );
  }

  const currentPrice = prices[selected.id]?.current ?? selected.basePrice;
  const status = getBudgetStatus(currentPrice, selected.flightBudget);
  const delta = budgetDelta(currentPrice, selected.flightBudget);
  const route = routeString(departureAirport, selected);

  const deltaClass =
    delta < 0 ? styles.deltaUnder : delta > 0 ? styles.deltaOver : styles.deltaEven;

  return (
    <div className={styles.card}>
      <span className={styles.cardTitle}>Flight tracker</span>

      {/* Destination info */}
      <div className={styles.destBlock}>
        <div>
          <div className={styles.destName}>{selected.name}</div>
          <div className={styles.destCountry}>{selected.country}</div>
          <div className={styles.destRoute}>{route}</div>
        </div>
        <RankBadge rank={selected.dreamRank} />
      </div>

      <hr className={styles.divider} />

      {/* Price details */}
      <div className={styles.priceBlock}>
        <div className={styles.priceRow}>
          <span className={styles.priceLabel}>Current price</span>
          <span className={styles.priceValue}>{formatUSD(currentPrice)}</span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.priceLabel}>Flight budget</span>
          <span className={styles.priceValue}>{formatUSD(selected.flightBudget)}</span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.priceLabel}>Delta</span>
          <span className={deltaClass}>{formatDelta(delta)}</span>
        </div>
        <BudgetGauge current={currentPrice} budget={selected.flightBudget} status={status} />
      </div>

      {!selectedDestinationId && (
        <p className={styles.hint}>Showing rank #1 · click any row to change</p>
      )}
    </div>
  );
}
