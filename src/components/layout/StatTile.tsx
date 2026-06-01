import styles from './StatTile.module.css';

interface Dot {
  id: string;
  filled: boolean;
}

interface StatTileProps {
  variant?: 'inBudget';
  label: string;
  value: string;
  sub?: string;
  dots?: Dot[];
}

export function StatTile({ variant, label, value, sub, dots }: StatTileProps) {
  const isInBudget = variant === 'inBudget';

  return (
    <div className={`${styles.tile} ${isInBudget ? styles.tileInBudget : ''}`}>
      <span className={`${styles.label} ${isInBudget ? styles.labelInBudget : ''}`}>
        {label}
      </span>
      <span className={`${styles.value} ${isInBudget ? styles.valueInBudget : ''}`}>
        {value}
      </span>
      {sub && (
        <span className={`${styles.sub} ${isInBudget ? styles.subInBudget : ''}`}>
          {sub}
        </span>
      )}
      {dots && dots.length > 0 && (
        <div className={styles.dots}>
          {dots.map((dot) => (
            <span
              key={dot.id}
              className={`${styles.dot} ${dot.filled ? styles.dotFilled : styles.dotEmpty}`}
              aria-hidden="true"
            />
          ))}
        </div>
      )}
    </div>
  );
}
