import { useAppState } from '../../context/AppStateContext';
import { getBudgetStatus } from '../../utils/budgetStatus';
import { formatUSD } from '../../utils/format';
import { RankBadge } from '../ui/Badge';
import { StatusBadge } from '../ui/Badge';
import styles from './DreamRanking.module.css';

export function DreamRanking() {
  const { destinations, prices, selectedDestinationId, dispatch } = useAppState();

  const sorted = [...destinations].sort((a, b) => a.dreamRank - b.dreamRank);

  if (sorted.length === 0) {
    return (
      <div className={styles.card}>
        <span className={styles.cardTitle}>Dream ranking</span>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <span className={styles.cardTitle}>Dream ranking</span>
      <div className={styles.list}>
        {sorted.map((dest) => {
          const currentPrice = prices[dest.id]?.current ?? dest.basePrice;
          const status = getBudgetStatus(currentPrice, dest.flightBudget);
          const isSelected = dest.id === selectedDestinationId;

          return (
            <div
              key={dest.id}
              className={`${styles.item} ${isSelected ? styles.itemSelected : ''}`}
              onClick={() => dispatch({ type: 'SET_SELECTED', id: dest.id })}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  dispatch({ type: 'SET_SELECTED', id: dest.id });
                }
              }}
              aria-label={`Select ${dest.name}`}
            >
              <RankBadge rank={dest.dreamRank} />
              <div className={styles.destInfo}>
                <div className={styles.destName}>{dest.name}</div>
                <div className={styles.destCountry}>{dest.country}</div>
              </div>
              <div className={styles.right}>
                <StatusBadge status={status} />
                <span className={styles.price}>{formatUSD(currentPrice)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
