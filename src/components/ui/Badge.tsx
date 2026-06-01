import type { BudgetStatus } from '../../types';
import { STATUS_LABEL } from '../../utils/budgetStatus';
import styles from './Badge.module.css';

interface StatusBadgeProps {
  status: BudgetStatus;
}

const STATUS_CLASS: Record<BudgetStatus, string> = {
  deal: styles.deal,
  close: styles.close,
  over: styles.over,
  watching: styles.watching,
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles.statusBadge} ${STATUS_CLASS[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

interface RankBadgeProps {
  rank: number;
}

export function RankBadge({ rank }: RankBadgeProps) {
  const medalClass =
    rank === 1 ? styles.rankGold
    : rank === 2 ? styles.rankSilver
    : rank === 3 ? styles.rankBronze
    : styles.rankDefault;
  return (
    <span className={`${styles.badge} ${styles.rankBadge} ${medalClass}`}>
      {rank}
    </span>
  );
}
