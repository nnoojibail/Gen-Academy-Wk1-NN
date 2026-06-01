import type { BudgetStatus } from '../../types';
import { formatUSD } from '../../utils/format';
import styles from './BudgetGauge.module.css';

interface BudgetGaugeProps {
  current: number;
  budget: number;
  status: BudgetStatus;
}

const FILL_CLASS: Record<BudgetStatus, string> = {
  deal: styles.fillGreen,
  watching: styles.fillGreen,
  close: styles.fillAmber,
  over: styles.fillRed,
};

export function BudgetGauge({ current, budget, status }: BudgetGaugeProps) {
  const fillPct = Math.min((current / budget) * 100, 100);

  return (
    <div className={styles.wrap}>
      <div className={styles.track}>
        <div
          className={`${styles.fill} ${FILL_CLASS[status]}`}
          style={{ width: `${fillPct}%` }}
        />
      </div>
      <span className={styles.label}>
        {formatUSD(current)} / {formatUSD(budget)}
      </span>
    </div>
  );
}
